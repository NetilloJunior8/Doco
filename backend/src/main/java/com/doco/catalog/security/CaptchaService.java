package com.doco.catalog.security;

public interface CaptchaService {
    boolean verifyToken(String token, String clientIp);
}
