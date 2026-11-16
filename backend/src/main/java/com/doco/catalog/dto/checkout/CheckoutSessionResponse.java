package com.doco.catalog.dto.checkout;

import com.doco.catalog.domain.enums.OrderStatus;
import com.doco.catalog.domain.enums.PaymentProviderType;

import java.math.BigDecimal;

public record CheckoutSessionResponse(
        String orderNumber,
        OrderStatus status,
        PaymentProviderType paymentProvider,
        BigDecimal subtotalMxn,
        BigDecimal shippingMxn,
        BigDecimal totalMxn,
        String checkoutUrl,
        String instructions
) {
}
