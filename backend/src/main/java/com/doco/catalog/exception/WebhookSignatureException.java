package com.doco.catalog.exception;

import org.springframework.http.HttpStatus;

public class WebhookSignatureException extends ApiException {
    public WebhookSignatureException(String message) {
        super(HttpStatus.UNAUTHORIZED, "INVALID_WEBHOOK_SIGNATURE", message);
    }
}
