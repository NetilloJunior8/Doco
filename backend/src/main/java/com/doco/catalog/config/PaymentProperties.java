package com.doco.catalog.config;

import com.doco.catalog.domain.enums.PaymentProviderType;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@ConfigurationProperties(prefix = "app.payments")
public record PaymentProperties(
        PaymentProviderType defaultProvider,
        BigDecimal freeShippingThresholdMxn,
        BigDecimal flatShippingFeeMxn,
        String whatsappPhone,
        String mercadoPagoAccessToken,
        String mercadoPagoWebhookSecret,
        String stripeSecretKey,
        String stripeWebhookSecret,
        String frontendSuccessUrl,
        String frontendCancelUrl
) {
}
