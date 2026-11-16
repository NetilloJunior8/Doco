package com.doco.catalog;

import com.doco.catalog.security.CaptchaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"sqlite", "test"})
@TestPropertySource(properties = "app.captcha.enabled=true")
class SecurityCorsAndCaptchaTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CaptchaService captchaService;

    @Test
    void shouldAllowConfiguredCorsOriginAndRejectUnknownOrigin() throws Exception {
        mockMvc.perform(options("/api/v1/catalog/products")
                        .header(HttpHeaders.ORIGIN, "http://localhost:4200")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:4200"));

        mockMvc.perform(options("/api/v1/catalog/products")
                        .header(HttpHeaders.ORIGIN, "https://attacker-site.example")
                        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, "GET"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN));
    }

    @Test
    void shouldIncludeHardenedSecurityHeaders() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Content-Security-Policy"))
                .andExpect(header().string("X-Frame-Options", "DENY"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    @Test
    void shouldBlockCheckoutWhenCaptchaFailsAndProceedWhenCaptchaPasses() throws Exception {
        when(captchaService.verifyToken(eq("invalid-bot-token"), anyString())).thenReturn(false);
        when(captchaService.verifyToken(eq("valid-human-token"), anyString())).thenReturn(true);

        String loginPayload = "{\"email\":\"admin@doco.mx\",\"password\":\"DocoAdmin#2026!\"}";

        mockMvc.perform(post("/api/v1/auth/login")
                        .header("X-Captcha-Token", "invalid-bot-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("CAPTCHA_VERIFICATION_FAILED"));

        mockMvc.perform(post("/api/v1/auth/login")
                        .header("X-Captcha-Token", "valid-human-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty());
    }

    @Test
    void shouldBlockVulnerabilityScannersAndPenetrationProbes() throws Exception {
        // Block scanner User-Agent (sqlmap)
        mockMvc.perform(get("/api/v1/health")
                        .header(HttpHeaders.USER_AGENT, "sqlmap/1.5.2#stable"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("SHIELD_SECURITY_BLOCKED"));

        // Block path traversal attempt
        mockMvc.perform(get("/api/v1/catalog/products?file=../../etc/passwd"))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.errorCode").value("SHIELD_SECURITY_BLOCKED"));
    }
}
