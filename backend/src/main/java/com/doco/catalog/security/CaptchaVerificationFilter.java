package com.doco.catalog.security;

import com.doco.catalog.config.CaptchaProperties;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Enforces server-side CAPTCHA validation uniformly across protected public POST endpoints.
 */
@Component
public class CaptchaVerificationFilter extends OncePerRequestFilter {

    private final CaptchaProperties properties;
    private final CaptchaService captchaService;
    private final ClientIpResolver clientIpResolver;
    private final SecurityResponseWriter responseWriter;

    public CaptchaVerificationFilter(
            CaptchaProperties properties,
            CaptchaService captchaService,
            ClientIpResolver clientIpResolver,
            SecurityResponseWriter responseWriter
    ) {
        this.properties = properties;
        this.captchaService = captchaService;
        this.clientIpResolver = clientIpResolver;
        this.responseWriter = responseWriter;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!properties.enabled()
                || !HttpMethod.POST.matches(request.getMethod())
                || !isProtectedPath(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader(properties.headerName());
        String clientIp = clientIpResolver.resolve(request);

        if (!captchaService.verifyToken(token, clientIp)) {
            responseWriter.writeError(
                    response,
                    HttpStatus.FORBIDDEN,
                    "CAPTCHA_VERIFICATION_FAILED",
                    "Verificación anti-bot requerida o expirada. Completa el CAPTCHA e intenta de nuevo."
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isProtectedPath(String uri) {
        return properties.protectedPostPaths() != null
                && properties.protectedPostPaths().stream().anyMatch(uri::startsWith);
    }
}
