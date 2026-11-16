package com.doco.catalog.controller;

import com.doco.catalog.domain.enums.PaymentProviderType;
import com.doco.catalog.service.CheckoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/webhooks/payments")
public class PaymentWebhookController {

    private final CheckoutService checkoutService;

    public PaymentWebhookController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/mercadopago")
    public ResponseEntity<Void> handleMercadoPago(
            @RequestBody String rawPayload,
            @RequestHeader Map<String, String> headers
    ) {
        checkoutService.processWebhook(PaymentProviderType.MERCADO_PAGO, rawPayload, normalizeKeys(headers));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/stripe")
    public ResponseEntity<Void> handleStripe(
            @RequestBody String rawPayload,
            @RequestHeader Map<String, String> headers
    ) {
        checkoutService.processWebhook(PaymentProviderType.STRIPE, rawPayload, normalizeKeys(headers));
        return ResponseEntity.ok().build();
    }

    private Map<String, String> normalizeKeys(Map<String, String> headers) {
        return headers.entrySet().stream()
                .collect(Collectors.toMap(e -> e.getKey().toLowerCase(), Map.Entry::getValue, (a, b) -> a));
    }
}
