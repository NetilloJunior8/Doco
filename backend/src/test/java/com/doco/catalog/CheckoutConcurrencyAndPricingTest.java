package com.doco.catalog;

import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.payment.HmacSignatureHelper;
import com.doco.catalog.repository.ProductRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"sqlite", "test"})
class CheckoutConcurrencyAndPricingTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldComputeTotalsServerSideBeIdempotentAndPreventOverselling() throws Exception {
        Product cap = productRepository.findAll().stream()
                .filter(p -> p.getSku().equals("DOCO-AFL-006"))
                .findFirst()
                .orElseThrow();

        String payload = """
                {
                  "idempotencyKey": "idem-doco-checkout-0001",
                  "customerName": "Carlos Mendoza",
                  "customerEmail": "carlos@example.com",
                  "customerPhone": "6671234567",
                  "shippingCity": "Culiacán",
                  "shippingState": "Sinaloa",
                  "shippingPostalCode": "80000",
                  "shippingAddress": "Av. Álvaro Obregón 420 Centro",
                  "paymentProvider": "MERCADO_PAGO",
                  "items": [
                    { "productId": %d, "quantity": 1 }
                  ]
                }
                """.formatted(cap.getId());

        String firstRes = mockMvc.perform(post("/api/v1/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.subtotalMxn", is(1190.00)))
                .andExpect(jsonPath("$.shippingMxn", is(180.00)))
                .andExpect(jsonPath("$.totalMxn", is(1370.00)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        String orderNumber = JsonPath.read(firstRes, "$.orderNumber");

        // Repeating same idempotencyKey must NOT deduct stock twice
        mockMvc.perform(post("/api/v1/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderNumber", is(orderNumber)));

        Product updatedCap = productRepository.findById(cap.getId()).orElseThrow();
        assertThat(updatedCap.getStock()).isEqualTo(0);

        // New buyer with a new idempotency key must be blocked with 409 Conflict
        String secondBuyerPayload = payload.replace("idem-doco-checkout-0001", "idem-doco-checkout-0002");
        mockMvc.perform(post("/api/v1/checkout")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(secondBuyerPayload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode", is("INSUFFICIENT_STOCK")));

        // Webhook with forged signature must fail with 401
        String webhookBody = """
                {
                  "id": 987654,
                  "action": "payment.created",
                  "external_reference": "%s",
                  "data": { "id": "pay_123" },
                  "amount": 1370.00
                }
                """.formatted(orderNumber);

        mockMvc.perform(post("/api/v1/webhooks/payments/mercadopago")
                        .header("x-signature", "ts=1700000000,v1=deadbeef")
                        .header("x-request-id", "req-001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(webhookBody))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.errorCode", is("INVALID_WEBHOOK_SIGNATURE")));

        // Valid HMAC signature must mark order PAID
        String manifest = "id:pay_123;request-id:req-001;ts:1700000000;";
        String validSig = HmacSignatureHelper.hmacSha256Hex("test-mp-secret-key-2026", manifest);

        mockMvc.perform(post("/api/v1/webhooks/payments/mercadopago")
                        .header("x-signature", "ts=1700000000,v1=" + validSig)
                        .header("x-request-id", "req-001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(webhookBody))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/checkout/{orderNumber}", orderNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PAID")));
    }
}
