package com.doco.catalog.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "app.captcha")
public record CaptchaProperties(
        boolean enabled,
        String verifyUrl,
        String siteKey,
        String secretKey,
        String headerName,
        List<String> protectedPostPaths
) {
}
