package com.doco.catalog.payment;

import com.doco.catalog.config.PaymentProperties;
import com.doco.catalog.domain.entity.Order;
import com.doco.catalog.domain.enums.OrderStatus;
import com.doco.catalog.domain.enums.PaymentProviderType;
import com.doco.catalog.dto.checkout.PaymentWebhookResult;
import com.doco.catalog.exception.WebhookSignatureException;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Direct Mexico WhatsApp / SPEI reservation gateway for zero-fee launch without sacrificing atomic inventory control.
 */
@Component
public class WhatsappReservationGateway implements PaymentGateway {

    private final PaymentProperties properties;

    public WhatsappReservationGateway(PaymentProperties properties) {
        this.properties = properties;
    }

    @Override
    public PaymentProviderType provider() {
        return PaymentProviderType.TRANSFER_WHATSAPP;
    }

    @Override
    public PaymentInitResult createCheckout(Order order) {
        String itemsSummary = order.getItems().stream()
                .map(i -> "• " + i.getTitleSnapshot() + " [" + i.getSkuSnapshot() + "] x" + i.getQuantity() + " -> $" + i.getUnitPriceMxn().toPlainString() + " MXN")
                .collect(Collectors.joining("\n"));

        String shippingNote = (order.getShippingMxn() != null && order.getShippingMxn().signum() == 0)
                ? "GRATIS (Culiacán)"
                : "$" + (order.getShippingMxn() != null ? order.getShippingMxn().toPlainString() : "0") + " MXN";

        String message = """
                *PEDIDO DOCO ARCHIVE // CULIACÁN, SIN*
                *Orden:* %s
                ----------------------------------------
                *CLIENTE:*
                *Nombre:* %s
                *Tel:* %s
                *Destino:* %s, %s (CP %s)
                *Dirección:* %s
                ----------------------------------------
                *PIEZAS APARTADAS:*
                %s
                ----------------------------------------
                *Subtotal:* $%s MXN
                *Entrega:* %s
                *TOTAL A PAGAR:* $%s MXN
                ----------------------------------------
                Hola DOCO, ¿me podrían proporcionar los datos para transferencia SPEI / depósito para finalizar mi compra?
                """.formatted(
                order.getOrderNumber(),
                order.getCustomerName(),
                order.getCustomerPhone(),
                order.getShippingCity(),
                order.getShippingState(),
                order.getShippingPostalCode(),
                order.getShippingAddress(),
                itemsSummary,
                order.getSubtotalMxn().toPlainString(),
                shippingNote,
                order.getTotalMxn().toPlainString()
        );

        String url = "https://wa.me/" + properties.whatsappPhone()
                + "?text=" + URLEncoder.encode(message, StandardCharsets.UTF_8);

        return new PaymentInitResult(
                "WA-" + order.getOrderNumber(),
                url,
                OrderStatus.RESERVED_WHATSAPP,
                "Pieza apartada con éxito. Envía el mensaje generado a WhatsApp (667 203 3174) para recibir los datos de transferencia o depósito OXXO."
        );
    }

    @Override
    public PaymentWebhookResult parseAndVerifyWebhook(String rawPayload, Map<String, String> normalizedHeaders) {
        throw new WebhookSignatureException("TRANSFER_WHATSAPP no utiliza webhooks externos.");
    }
}
