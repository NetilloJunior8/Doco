package com.doco.catalog.dto.checkout;

import com.doco.catalog.domain.enums.PaymentProviderType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CheckoutRequest(
        @NotBlank @Size(min = 8, max = 100) String idempotencyKey,
        @NotBlank @Size(min = 2, max = 120) String customerName,
        @NotBlank @Email String customerEmail,
        @NotBlank @Pattern(regexp = "^[0-9+\\-\\s]{10,20}$", message = "Teléfono inválido") String customerPhone,
        @NotBlank @Size(max = 100) String shippingCity,
        @NotBlank @Size(max = 80) String shippingState,
        @NotBlank @Pattern(regexp = "^[0-9]{5}$", message = "Código postal de México debe tener 5 dígitos") String shippingPostalCode,
        @NotBlank @Size(min = 6, max = 300) String shippingAddress,
        @NotNull PaymentProviderType paymentProvider,
        @NotEmpty @Valid List<CheckoutItemRequest> items
) {
}
