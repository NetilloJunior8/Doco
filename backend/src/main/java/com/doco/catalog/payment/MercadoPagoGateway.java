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
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Mercado Pago Checkout Pro gateway (tarjetas MX, SPEI, OXXO, MSI) with HMAC x-signature verification.
 */
@Component
public class MercadoPagoGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(MercadoPagoGateway.class);
    private static final String MP_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";

    private final PaymentProperties properties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public MercadoPagoGateway(PaymentProperties properties, RestClient externalApiRestClient, ObjectMapper objectMapper) {
        this.properties = properties;
        this.restClient = externalApiRestClient;
        this.objectMapper = objectMapper;
    }

    @Override
    public PaymentProviderType provider() {
        return PaymentProviderType.MERCADO_PAGO;
    }

    @Override
    public PaymentInitResult createCheckout(Order order) {
        if (properties.mercadoPagoAccessToken() == null || properties.mercadoPagoAccessToken().isBlank()) {
            log.info("Mercado Pago access token not configured; returning sandbox checkout preview for {}", order.getOrderNumber());
            return new PaymentInitResult(
                    "MP-SANDBOX-" + order.getOrderNumber(),
                    properties.frontendSuccessUrl() + "?order=" + order.getOrderNumber() + "&mode=mp-sandbox",
                    OrderStatus.PENDING_PAYMENT,
                    "Modo sandbox local activo. Configura MP_ACCESS_TOKEN para cobrar tarjetas MX, SPEI y OXXO en vivo."
            );
        }

        List<Map<String, Object>> mpItems = order.getItems().stream()
                .map(item -> Map.<String, Object>of(
                        "id", item.getSkuSnapshot(),
                        "title", item.getTitleSnapshot(),
                        "quantity", item.getQuantity(),
                        "currency_id", "MXN",
                        "unit_price", item.getUnitPriceMxn()
                ))
                .toList();

        Map<String, Object> payload = new HashMap<>();
        payload.put("items", mpItems);
        payload.put("external_reference", order.getOrderNumber());
        payload.put("back_urls", Map.of(
                "success", properties.frontendSuccessUrl() + "?order=" + order.getOrderNumber(),
                "failure", properties.frontendCancelUrl() + "?order=" + order.getOrderNumber(),
                "pending", properties.frontendSuccessUrl() + "?order=" + order.getOrderNumber() + "&status=pending"
        ));
        payload.put("auto_return", "approved");
        if (order.getShippingMxn().compareTo(BigDecimal.ZERO) > 0) {
            payload.put("shipments", Map.of("cost", order.getShippingMxn(), "mode", "not_specified"));
        }

        JsonNode response = restClient.post()
                .uri(MP_PREFERENCES_URL)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.mercadoPagoAccessToken())
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(JsonNode.class);

        String preferenceId = response != null ? response.path("id").asText() : order.getOrderNumber();
        String initPoint = response != null ? response.path("init_point").asText() : properties.frontendSuccessUrl();
        return new PaymentInitResult(
                preferenceId,
                initPoint,
                OrderStatus.PENDING_PAYMENT,
                "Redirigiendo a Mercado Pago (Tarjeta, SPEI o OXXO)."
        );
    }

    @Override
    public PaymentWebhookResult parseAndVerifyWebhook(String rawPayload, Map<String, String> headers) {
        String secret = properties.mercadoPagoWebhookSecret();
        if (secret == null || secret.isBlank()) {
            throw new WebhookSignatureException("Mercado Pago webhook secret no configurado.");
        }

        String xSignature = headers.getOrDefault("x-signature", "");
        String xRequestId = headers.getOrDefault("x-request-id", "");
        String ts = extractTag(xSignature, "ts");
        String v1 = extractTag(xSignature, "v1");

        if (ts == null || v1 == null) {
            throw new WebhookSignatureException("Cabecera x-signature de Mercado Pago incompleta.");
        }

        try {
            JsonNode root = objectMapper.readTree(rawPayload);
            String dataId = root.path("data").path("id").asText("");
            String manifest = "id:" + dataId + ";request-id:" + xRequestId + ";ts:" + ts + ";";
            String expected = HmacSignatureHelper.hmacSha256Hex(secret, manifest);

            if (!HmacSignatureHelper.constantTimeEquals(expected, v1)) {
                throw new WebhookSignatureException("Firma HMAC de Mercado Pago inválida.");
            }

            String eventId = "mp-" + root.path("id").asText(dataId + "-" + ts);
            String orderRef = root.path("external_reference").asText(dataId);
            String action = root.path("action").asText(root.path("type").asText("payment.updated"));
            OrderStatus status = action.contains("cancelled") || action.contains("refunded")
                    ? OrderStatus.CANCELLED
                    : OrderStatus.PAID;

            BigDecimal amount = root.path("amount").isNumber()
                    ? root.path("amount").decimalValue()
                    : BigDecimal.ZERO;

            return new PaymentWebhookResult(eventId, orderRef, status, amount, action);
        } catch (WebhookSignatureException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new WebhookSignatureException("Payload de webhook de Mercado Pago inválido.");
        }
    }

    private String extractTag(String header, String key) {
        for (String part : header.split(",")) {
            String[] kv = part.trim().split("=", 2);
            if (kv.length == 2 && kv[0].trim().equals(key)) {
                return kv[1].trim();
            }
        }
        return null;
    }
}
