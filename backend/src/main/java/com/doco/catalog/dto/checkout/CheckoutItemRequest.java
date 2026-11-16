package com.doco.catalog.dto.checkout;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CheckoutItemRequest(
        @NotNull Long productId,
        @NotNull @Min(1) Integer quantity
) {
}
