package com.doco.catalog.domain.entity;

import com.doco.catalog.domain.enums.OrderStatus;
import com.doco.catalog.domain.enums.PaymentProviderType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_orders_number", columnList = "order_number", unique = true),
        @Index(name = "idx_orders_idempotency", columnList = "idempotency_key", unique = true),
        @Index(name = "idx_orders_status", columnList = "status")
})
public class Order extends BaseAuditableEntity {

    @Column(name = "order_number", nullable = false, unique = true, length = 40)
    private String orderNumber;

    @Column(name = "idempotency_key", nullable = false, unique = true, length = 100)
    private String idempotencyKey;

    @Column(name = "customer_name", nullable = false, length = 120)
    private String customerName;

    @Column(name = "customer_email", nullable = false, length = 160)
    private String customerEmail;

    @Column(name = "customer_phone", nullable = false, length = 30)
    private String customerPhone;

    @Column(name = "shipping_city", nullable = false, length = 100)
    private String shippingCity;

    @Column(name = "shipping_state", nullable = false, length = 80)
    private String shippingState;

    @Column(name = "shipping_postal_code", nullable = false, length = 12)
    private String shippingPostalCode;

    @Column(name = "shipping_address", nullable = false, length = 300)
    private String shippingAddress;

    @Column(name = "subtotal_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotalMxn;

    @Column(name = "shipping_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal shippingMxn;

    @Column(name = "total_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalMxn;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OrderStatus status = OrderStatus.PENDING_PAYMENT;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_provider", nullable = false, length = 30)
    private PaymentProviderType paymentProvider;

    @Column(name = "external_reference", length = 160)
    private String externalReference;

    @Column(name = "checkout_url", length = 1000)
    private String checkoutUrl;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        item.setOrder(this);
        this.items.add(item);
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getShippingCity() { return shippingCity; }
    public void setShippingCity(String shippingCity) { this.shippingCity = shippingCity; }

    public String getShippingState() { return shippingState; }
    public void setShippingState(String shippingState) { this.shippingState = shippingState; }

    public String getShippingPostalCode() { return shippingPostalCode; }
    public void setShippingPostalCode(String shippingPostalCode) { this.shippingPostalCode = shippingPostalCode; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public BigDecimal getSubtotalMxn() { return subtotalMxn; }
    public void setSubtotalMxn(BigDecimal subtotalMxn) { this.subtotalMxn = subtotalMxn; }

    public BigDecimal getShippingMxn() { return shippingMxn; }
    public void setShippingMxn(BigDecimal shippingMxn) { this.shippingMxn = shippingMxn; }

    public BigDecimal getTotalMxn() { return totalMxn; }
    public void setTotalMxn(BigDecimal totalMxn) { this.totalMxn = totalMxn; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public PaymentProviderType getPaymentProvider() { return paymentProvider; }
    public void setPaymentProvider(PaymentProviderType paymentProvider) { this.paymentProvider = paymentProvider; }

    public String getExternalReference() { return externalReference; }
    public void setExternalReference(String externalReference) { this.externalReference = externalReference; }

    public String getCheckoutUrl() { return checkoutUrl; }
    public void setCheckoutUrl(String checkoutUrl) { this.checkoutUrl = checkoutUrl; }

    public List<OrderItem> getItems() { return items; }
}
