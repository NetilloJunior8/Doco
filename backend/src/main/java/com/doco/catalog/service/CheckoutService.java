package com.doco.catalog.service;

import com.doco.catalog.config.PaymentProperties;
import com.doco.catalog.domain.entity.Order;
import com.doco.catalog.domain.entity.OrderItem;
import com.doco.catalog.domain.entity.PaymentTransaction;
import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.domain.enums.OrderStatus;
import com.doco.catalog.domain.enums.PaymentProviderType;
import com.doco.catalog.dto.checkout.CheckoutItemRequest;
import com.doco.catalog.dto.checkout.CheckoutRequest;
import com.doco.catalog.dto.checkout.CheckoutSessionResponse;
import com.doco.catalog.dto.checkout.PaymentWebhookResult;
import com.doco.catalog.exception.InsufficientStockException;
import com.doco.catalog.exception.ResourceNotFoundException;
import com.doco.catalog.payment.HmacSignatureHelper;
import com.doco.catalog.payment.PaymentGateway;
import com.doco.catalog.payment.PaymentGatewayRegistry;
import com.doco.catalog.payment.PaymentInitResult;
import com.doco.catalog.repository.OrderRepository;
import com.doco.catalog.repository.PaymentTransactionRepository;
import com.doco.catalog.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Year;
import java.util.Map;
import java.util.Optional;

@Service
public class CheckoutService {

    private static final String ORDER_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final PaymentGatewayRegistry gatewayRegistry;
    private final PaymentProperties paymentProperties;

    public CheckoutService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            PaymentTransactionRepository paymentTransactionRepository,
            PaymentGatewayRegistry gatewayRegistry,
            PaymentProperties paymentProperties
    ) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.paymentTransactionRepository = paymentTransactionRepository;
        this.gatewayRegistry = gatewayRegistry;
        this.paymentProperties = paymentProperties;
    }

    /**
     * Creates an idempotent checkout session with 100% server-side pricing and atomic stock decrement.
     */
    @Transactional
    public CheckoutSessionResponse createCheckout(CheckoutRequest request) {
        Optional<Order> existing = orderRepository.findByIdempotencyKey(request.idempotencyKey().trim());
        if (existing.isPresent()) {
            Order order = existing.get();
            return new CheckoutSessionResponse(
                    order.getOrderNumber(),
                    order.getStatus(),
                    order.getPaymentProvider(),
                    order.getSubtotalMxn(),
                    order.getShippingMxn(),
                    order.getTotalMxn(),
                    order.getCheckoutUrl(),
                    "Sesión recuperada de forma segura (idempotencia)."
            );
        }

        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setIdempotencyKey(request.idempotencyKey().trim());
        order.setCustomerName(request.customerName().trim());
        order.setCustomerEmail(request.customerEmail().trim().toLowerCase());
        order.setCustomerPhone(request.customerPhone().trim());
        order.setShippingCity(request.shippingCity().trim());
        order.setShippingState(request.shippingState().trim());
        order.setShippingPostalCode(request.shippingPostalCode().trim());
        order.setShippingAddress(request.shippingAddress().trim());
        order.setPaymentProvider(request.paymentProvider());

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CheckoutItemRequest itemReq : request.items()) {
            Product product = productRepository.findById(itemReq.productId())
                    .filter(Product::isActive)
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no disponible ID " + itemReq.productId()));

            if (product.getStock() < itemReq.quantity()) {
                throw new InsufficientStockException(
                        "Stock insuficiente para '" + product.getTitle() + "'. Disponible: " + product.getStock()
                );
            }

            product.setStock(product.getStock() - itemReq.quantity());
            productRepository.saveAndFlush(product);

            BigDecimal lineTotal = product.getPriceMxn().multiply(BigDecimal.valueOf(itemReq.quantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setSkuSnapshot(product.getSku());
            item.setTitleSnapshot(product.getTitle());
            item.setUnitPriceMxn(product.getPriceMxn());
            item.setQuantity(itemReq.quantity());
            item.setLineTotalMxn(lineTotal);
            order.addItem(item);
        }

        BigDecimal shipping = subtotal.compareTo(paymentProperties.freeShippingThresholdMxn()) >= 0
                ? BigDecimal.ZERO
                : paymentProperties.flatShippingFeeMxn();

        BigDecimal scaledSubtotal = subtotal.setScale(2, java.math.RoundingMode.HALF_UP);
        BigDecimal scaledShipping = shipping.setScale(2, java.math.RoundingMode.HALF_UP);
        order.setSubtotalMxn(scaledSubtotal);
        order.setShippingMxn(scaledShipping);
        order.setTotalMxn(scaledSubtotal.add(scaledShipping));

        PaymentGateway gateway = gatewayRegistry.get(request.paymentProvider());
        PaymentInitResult initResult = gateway.createCheckout(order);
        order.setExternalReference(initResult.externalReference());
        order.setCheckoutUrl(initResult.checkoutUrl());
        order.setStatus(initResult.initialOrderStatus());

        Order saved = orderRepository.save(order);
        return new CheckoutSessionResponse(
                saved.getOrderNumber(),
                saved.getStatus(),
                saved.getPaymentProvider(),
                saved.getSubtotalMxn(),
                saved.getShippingMxn(),
                saved.getTotalMxn(),
                saved.getCheckoutUrl(),
                initResult.instructions()
        );
    }

    @Transactional(readOnly = true)
    public CheckoutSessionResponse getOrderStatus(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado: " + orderNumber));
        return new CheckoutSessionResponse(
                order.getOrderNumber(),
                order.getStatus(),
                order.getPaymentProvider(),
                order.getSubtotalMxn(),
                order.getShippingMxn(),
                order.getTotalMxn(),
                order.getCheckoutUrl(),
                "Estado actual del pedido."
        );
    }

    @Transactional
    public void processWebhook(PaymentProviderType provider, String rawPayload, Map<String, String> headers) {
        PaymentGateway gateway = gatewayRegistry.get(provider);
        PaymentWebhookResult result = gateway.parseAndVerifyWebhook(rawPayload, headers);

        if (paymentTransactionRepository.existsByProviderEventId(result.providerEventId())) {
            return; // Idempotent webhook handling
        }

        Order order = orderRepository.findByOrderNumber(result.orderReference())
                .or(() -> orderRepository.findByExternalReference(result.orderReference()))
                .orElseThrow(() -> new ResourceNotFoundException("Pedido de webhook no encontrado."));

        if (result.targetStatus() == OrderStatus.CANCELLED && order.getStatus() == OrderStatus.PENDING_PAYMENT) {
            restoreInventory(order);
        }
        if (order.getStatus() != OrderStatus.PAID) {
            order.setStatus(result.targetStatus());
            orderRepository.save(order);
        }

        PaymentTransaction tx = new PaymentTransaction();
        tx.setOrder(order);
        tx.setProvider(provider);
        tx.setProviderEventId(result.providerEventId());
        tx.setAmountMxn(result.paidAmountMxn().compareTo(BigDecimal.ZERO) > 0
                ? result.paidAmountMxn()
                : order.getTotalMxn());
        tx.setStatus(result.rawStatus());
        tx.setPayloadSha256(HmacSignatureHelper.sha256Hex(rawPayload));
        paymentTransactionRepository.save(tx);
    }

    private void restoreInventory(Order order) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }
    }

    private String generateOrderNumber() {
        StringBuilder sb = new StringBuilder("DOCO-");
        sb.append(Year.now().getValue()).append("-");
        for (int i = 0; i < 6; i++) {
            sb.append(ORDER_CHARS.charAt(RANDOM.nextInt(ORDER_CHARS.length())));
        }
        return sb.toString();
    }
}
