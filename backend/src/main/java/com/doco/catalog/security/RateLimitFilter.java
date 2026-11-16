package com.doco.catalog.security;

import com.doco.catalog.config.RateLimitProperties;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private enum Tier {
        AUTH_CHECKOUT,
        WEBHOOK,
        PUBLIC_READ
    }

    private final RateLimitProperties properties;
    private final ClientIpResolver clientIpResolver;
    private final SecurityResponseWriter responseWriter;
    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .maximumSize(20_000)
            .expireAfterAccess(15, TimeUnit.MINUTES)
            .build();

    public RateLimitFilter(
            RateLimitProperties properties,
            ClientIpResolver clientIpResolver,
            SecurityResponseWriter responseWriter
    ) {
        this.properties = properties;
        this.clientIpResolver = clientIpResolver;
        this.responseWriter = responseWriter;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!properties.enabled() || HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        if (!path.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        Tier tier = resolveTier(path);
        String key = tier.name() + ":" + clientIpResolver.resolve(request);
        Bucket bucket = buckets.get(key, k -> createBucket(tier));

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        response.setHeader("X-RateLimit-Remaining", String.valueOf(probe.getRemainingTokens()));

        if (probe.isConsumed()) {
            filterChain.doFilter(request, response);
            return;
        }

        long waitSeconds = Math.max(1L, TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill()));
        response.setHeader("Retry-After", String.valueOf(waitSeconds));
        responseWriter.writeError(
                response,
                HttpStatus.TOO_MANY_REQUESTS,
                "RATE_LIMIT_EXCEEDED",
                "Demasiadas solicitudes. Intenta nuevamente en " + waitSeconds + " segundos."
        );
    }

    private Tier resolveTier(String path) {
        if (path.startsWith("/api/v1/checkout") || path.startsWith("/api/v1/auth")) {
            return Tier.AUTH_CHECKOUT;
        }
        if (path.startsWith("/api/v1/webhooks")) {
            return Tier.WEBHOOK;
        }
        return Tier.PUBLIC_READ;
    }

    private Bucket createBucket(Tier tier) {
        int capacity = switch (tier) {
            case AUTH_CHECKOUT -> properties.authAndCheckoutPerMinute();
            case WEBHOOK -> properties.webhookPerMinute();
            case PUBLIC_READ -> properties.catalogReadsPerMinute();
        };
        Bandwidth limit = Bandwidth.builder()
                .capacity(capacity)
                .refillGreedy(capacity, Duration.ofMinutes(1))
                .build();
        return Bucket.builder().addLimit(limit).build();
    }
}
