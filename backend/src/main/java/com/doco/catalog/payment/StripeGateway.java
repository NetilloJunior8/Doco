package com.doco.catalog.payment;

import com.doco.catalog.config.PaymentProperties;
import com.doco.catalog.domain.entity.Order;
import com.doco.catalog.domain.enums.OrderStatus;
import com.doco.catalog.domain.enums.PaymentProviderType;
import com.doco.catalog.dto.checkout.PaymentWebhookResult;
import com.doco.catalog.exception.WebhookSignatureException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

/**
 * Stripe Checkout Session gateway with Stripe-Signature HMAC verification and 300s replay protection.
 */
@Component
public class StripeGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(StripeGateway.class);
    private static final String STRIPE_SESSIONS_URL = "https://api.stripe.com/v1/checkout/sessions";
    private static final long MAX_TIMESTAMP_DRIFT_SECONDS = 300;

    private final PaymentProperties properties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public StripeGateway(PaymentProperties properties, RestClient externalApiRestClient, ObjectMapper objectMapper) {
        this.properties = properties;
        this.restClient = externalApiRestClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public PaymentProviderType provider() {
        return PaymentProviderType.STRIPE;
    }

    @Override
    public PaymentInitResult createCheckout(Order order) {
        if (properties.stripeSecretKey() == null || properties.stripeSecretKey().isBlank()) {
            log.info("Stripe secret key not configured; returning sandbox checkout preview for {}", order.getOrderNumber());
            return new PaymentInitResult(
                    "STRIPE-SANDBOX-" + order.getOrderNumber(),
                    properties.frontendSuccessUrl() + "?order=" + order.getOrderNumber() + "&mode=stripe-sandbox",
                    OrderStatus.PENDING_PAYMENT,
                    "Modo sandbox local activo. Configura STRIPE_SECRET_KEY para sesiones Checkout en producción."
            );
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mode", "payment");
        form.add("success_url", properties.frontendSuccessUrl() + "?order=" + order.getOrderNumber());
        form.add("cancel_url", properties.frontendCancelUrl() + "?order=" + order.getOrderNumber());
        form.add("client_reference_id", order.getOrderNumber());
        form.add("customer_email", order.getCustomerEmail());

        int idx = 0;
        for (var item : order.getItems()) {
            long unitCents = item.getUnitPriceMxn().movePointRight(2).longValueExact();
            form.add("line_items[" + idx + "][price_data][currency]", "mxn");
            form.add("line_items[" + idx + "][price_data][product_data][name]", item.getTitleSnapshot());
            form.add("line_items[" + idx + "][price_data][unit_amount]", String.valueOf(unitCents));
            form.add("line_items[" + idx + "][quantity]", String.valueOf(item.getQuantity()));
            idx++;
        }
        if (order.getShippingMxn().compareTo(BigDecimal.ZERO) > 0) {
            long shipCents = order.getShippingMxn().movePointRight(2).longValueExact();
            form.add("line_items[" + idx + "][price_data][currency]", "mxn");
            form.add("line_items[" + idx + "][price_data][product_data][name]", "Envío Nacional MX");
            form.add("line_items[" + idx + "][price_data][unit_amount]", String.valueOf(shipCents));
            form.add("line_items[" + idx + "][quantity]", "1");
        }

        JsonNode response = restClient.post()
                .uri(STRIPE_SESSIONS_URL)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.stripeSecretKey())
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(JsonNode.class);

        String sessionId = response != null ? response.path("id").asText() : order.getOrderNumber();
        String url = response != null ? response.path("url").asText() : properties.frontendSuccessUrl();
        return new PaymentInitResult(
                sessionId,
                url,
                OrderStatus.PENDING_PAYMENT,
                "Redirigiendo a Stripe Checkout (Pago internacional / Apple Pay / Tarjeta)."
        );
    }

    @Override
    public PaymentWebhookResult parseAndVerifyWebhook(String rawPayload, Map<String, String> headers) {
        String secret = properties.stripeWebhookSecret();
        if (secret == null || secret.isBlank()) {
            throw new WebhookSignatureException("Stripe webhook secret no configurado.");
        }

        String sigHeader = headers.getOrDefault("stripe-signature", "");
        String timestamp = null;
        String v1 = null;
        for (String part : sigHeader.split(",")) {
            String[] kv = part.trim().split("=", 2);
            if (kv.length == 2) {
                if ("t".equals(kv[0])) timestamp = kv[1];
                if ("v1".equals(kv[0])) v1 = kv[1];
            }
        }
        if (timestamp == null || v1 == null) {
            throw new WebhookSignatureException("Cabecera Stripe-Signature inválida.");
        }

        long tsSeconds;
        try {
            tsSeconds = Long.parseLong(timestamp);
        } catch (NumberFormatException ex) {
            throw new WebhookSignatureException("Timestamp de Stripe-Signature inválido.");
        }

        if (Math.abs(Instant.now().getEpochSecond() - tsSeconds) > MAX_TIMESTAMP_DRIFT_SECONDS) {
            throw new WebhookSignatureException("Webhook de Stripe expirado (replay window excedida).");
        }

        String signedPayload = timestamp + "." + rawPayload;
        String expected = HmacSignatureHelper.hmacSha256Hex(secret, signedPayload);
        if (!HmacSignatureHelper.constantTimeEquals(expected, v1)) {
            throw new WebhookSignatureException("Firma Stripe-Signature inválida.");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String eventId = "stripe-" + root.path("id").asText();
            String type = root.path("type").asText();
            JsonNode obj = root.path("data").path("object");
            String orderRef = obj.path("client_reference_id").asText(obj.path("id").asText());

            OrderStatus targetStatus = type.contains("expired") || type.contains("refunded")
                    ? OrderStatus.CANCELLED
                    : OrderStatus.PAID;

            long amountCents = obj.path("amount_total").asLong(0L);
            BigDecimal amountMxn = BigDecimal.valueOf(amountCents).movePointLeft(2);
            return new PaymentWebhookResult(eventId, orderRef, targetStatus, amountMxn, type);
        } catch (Exception ex) {
            throw new WebhookSignatureException("Payload JSON de Stripe inválido.");
        }
    }
}
