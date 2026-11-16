package com.doco.catalog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security")
public record SecurityProperties(
        String jwtSecret,
        long jwtExpirationMs,
        String cspPolicy,
        String bootstrapAdminEmail,
        String bootstrapAdminPassword
) {
}
