package com.doco.catalog.exception;

import org.springframework.http.HttpStatus;

public class BusinessConflictException extends ApiException {
    public BusinessConflictException(String message) {
        super(HttpStatus.CONFLICT, "BUSINESS_CONFLICT", message);
    }
}
