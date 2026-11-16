package com.doco.catalog.payment;

import com.doco.catalog.domain.entity.Order;
import com.doco.catalog.domain.enums.PaymentProviderType;
import com.doco.catalog.dto.checkout.PaymentWebhookResult;

import java.util.Map;

public interface PaymentGateway {
    PaymentProviderType provider();
    PaymentInitResult createCheckout(Order order);
    PaymentWebhookResult parseAndVerifyWebhook(String rawPayload, Map<String, String> normalizedHeaders);
}
