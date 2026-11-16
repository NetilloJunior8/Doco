package com.doco.catalog.dto.auth;

import com.doco.catalog.domain.enums.UserRole;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInMs,
        String email,
        String fullName,
        UserRole role
) {
}
