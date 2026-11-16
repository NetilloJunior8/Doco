package com.doco.catalog.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Enterprise anti-bot and anti-penetration shield.
 * Blocks automated vulnerability scanners, scrapers, path traversal,
 * SQL injection probes, and malicious bot user agents before reaching application controllers.
 */
@Component
public class AntiBotAndScannerFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AntiBotAndScannerFilter.class);

    private final SecurityResponseWriter responseWriter;

    // Known malicious security scanners and automated scraping bot signatures
    private static final Set<String> BLOCKED_USER_AGENTS = Set.of(
            "sqlmap",
            "nikto",
            "dirbuster",
            "gobuster",
            "wpscan",
            "nmap",
            "masscan",
            "nuclei",
            "acunetix",
            "havij",
            "nessus",
            "zgrab",
            "openvas"
    );

    // Common probe and attack path prefixes
    private static final Set<String> FORBIDDEN_PATH_SUBSTRINGS = Set.of(
            "../",
            "..\\",
            "%2e%2e",
            ".env",
            "wp-login",
            "wp-admin",
            "xmlrpc.php",
            "phpmyadmin",
            "/.git",
            "/.svn",
            "/etc/passwd",
            "/etc/shadow",
            "web.config",
            "actuator/env",
            "actuator/restart"
    );

    // Injection attack patterns in URL/queries
    private static final Pattern INJECTION_PATTERN = Pattern.compile(
            "(?i)(<script|javascript:|union\\s+select|information_schema|waitfor\\s+delay|benchmark\\(|exec\\s*\\()",
            Pattern.CASE_INSENSITIVE
    );

    public AntiBotAndScannerFilter(SecurityResponseWriter responseWriter) {
        this.responseWriter = responseWriter;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String userAgent = request.getHeader("User-Agent");

        // 1. Check for malicious scanner user-agents
        if (userAgent != null) {
            String lowerUa = userAgent.toLowerCase();
            for (String blockedUa : BLOCKED_USER_AGENTS) {
                if (lowerUa.contains(blockedUa)) {
                    log.warn("Blocked penetration scanner bot [{}] from IP: {}", blockedUa, request.getRemoteAddr());
                    blockRequest(response, "Automated vulnerability scanner or malicious bot blocked.");
                    return;
                }
            }
        }

        // 2. Check for path traversal and known attack path probes in URI and Query
        String lowerTarget = (uri + (queryString != null ? "?" + queryString : "")).toLowerCase();
        for (String forbidden : FORBIDDEN_PATH_SUBSTRINGS) {
            if (lowerTarget.contains(forbidden)) {
                log.warn("Blocked path or probe [{}] from IP: {}", lowerTarget, request.getRemoteAddr());
                blockRequest(response, "Invalid or prohibited resource path requested.");
                return;
            }
        }

        // 3. Inspect query string for injection patterns
        if (queryString != null) {
            try {
                String decodedQuery = URLDecoder.decode(queryString, StandardCharsets.UTF_8);
                if (INJECTION_PATTERN.matcher(decodedQuery).find()) {
                    log.warn("Blocked injection attempt in query [{}] from IP: {}", decodedQuery, request.getRemoteAddr());
                    blockRequest(response, "Malicious or illegal query parameter pattern detected.");
                    return;
                }
            } catch (Exception ignored) {
                // Ignore decoding errors cleanly
            }
        }

        filterChain.doFilter(request, response);
    }

    private void blockRequest(HttpServletResponse response, String message) throws IOException {
        responseWriter.writeError(
                response,
                HttpStatus.FORBIDDEN,
                "SHIELD_SECURITY_BLOCKED",
                message
        );
    }
}
