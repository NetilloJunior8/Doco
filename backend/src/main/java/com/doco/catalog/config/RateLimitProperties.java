package com.doco.catalog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(
        boolean enabled,
        int catalogReadsPerMinute,
        int authAndCheckoutPerMinute,
        int webhookPerMinute,
        boolean trustProxyHeaders
) {
}
