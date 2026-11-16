package com.doco.catalog.payment;

import com.doco.catalog.domain.enums.OrderStatus;

public record PaymentInitResult(
        String externalReference,
        String checkoutUrl,
        OrderStatus initialOrderStatus,
        String instructions
) {
}
