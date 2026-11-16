package com.doco.catalog.security;

import com.doco.catalog.config.CaptchaProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Server-side Cloudflare Turnstile verifier. Fails closed if secret or verification fails.
 */
@Service
public class CloudflareTurnstileService implements CaptchaService {

    private static final Logger log = LoggerFactory.getLogger(CloudflareTurnstileService.class);

    private final CaptchaProperties properties;
    private final RestClient restClient;

    public CloudflareTurnstileService(CaptchaProperties properties, RestClient externalApiRestClient) {
        this.properties = properties;
        this.restClient = externalApiRestClient;
    }

    @Override
    public boolean verifyToken(String token, String clientIp) {
        if (!properties.enabled()) {
            return true;
        }
        if (token == null || token.isBlank() || properties.secretKey() == null || properties.secretKey().isBlank()) {
            return false;
        }

        try {
            MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
            form.add("secret", properties.secretKey());
            form.add("response", token.trim());
            if (clientIp != null && !clientIp.isBlank()) {
                form.add("remoteip", clientIp);
            }

            TurnstileResponse response = restClient.post()
                    .uri(properties.verifyUrl())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(TurnstileResponse.class);

            boolean valid = response != null && response.success();
            if (!valid && response != null) {
                log.warn("Turnstile verification rejected token. errorCodes={}", response.errorCodes());
            }
            return valid;
        } catch (Exception ex) {
            log.error("Turnstile verification request failed; failing closed", ex);
            return false;
        }
    }

    public record TurnstileResponse(boolean success, List<String> errorCodes) {}
}
