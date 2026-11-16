package com.doco.catalog.dto.checkout;

import com.doco.catalog.domain.enums.OrderStatus;

import java.math.BigDecimal;

public record PaymentWebhookResult(
        String providerEventId,
        String orderReference,
        OrderStatus targetStatus,
        BigDecimal paidAmountMxn,
        String rawStatus
) {
}
