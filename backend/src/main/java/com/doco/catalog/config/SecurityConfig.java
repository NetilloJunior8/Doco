package com.doco.catalog.config;

import com.doco.catalog.security.AntiBotAndScannerFilter;
import com.doco.catalog.security.CaptchaVerificationFilter;
import com.doco.catalog.security.JwtAuthenticationFilter;
import com.doco.catalog.security.RateLimitFilter;
import com.doco.catalog.security.SecurityResponseWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final CorsProperties corsProperties;
    private final SecurityProperties securityProperties;
    private final AntiBotAndScannerFilter antiBotFilter;
    private final RateLimitFilter rateLimitFilter;
    private final CaptchaVerificationFilter captchaVerificationFilter;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SecurityResponseWriter responseWriter;

    public SecurityConfig(
            CorsProperties corsProperties,
            SecurityProperties securityProperties,
            AntiBotAndScannerFilter antiBotFilter,
            RateLimitFilter rateLimitFilter,
            CaptchaVerificationFilter captchaVerificationFilter,
            JwtAuthenticationFilter jwtAuthenticationFilter,
            SecurityResponseWriter responseWriter
    ) {
        this.corsProperties = corsProperties;
        this.securityProperties = securityProperties;
        this.antiBotFilter = antiBotFilter;
        this.rateLimitFilter = rateLimitFilter;
        this.captchaVerificationFilter = captchaVerificationFilter;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.responseWriter = responseWriter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives(securityProperties.cspPolicy()))
                        .frameOptions(HeadersConfigurer.FrameOptionsConfig::deny)
                        .contentTypeOptions(cto -> {})
                        .referrerPolicy(ref -> ref.policy(
                                ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .permissionsPolicyHeader(perm -> perm.policy("camera=(), microphone=(), geolocation=()"))
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, authEx) -> responseWriter.writeError(
                                res, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "Autenticación requerida."))
                        .accessDeniedHandler((req, res, accessEx) -> responseWriter.writeError(
                                res, HttpStatus.FORBIDDEN, "FORBIDDEN", "No tienes permisos para esta acción."))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/health", "/api/health", "/api/v1/catalog/**", "/api/catalog/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login", "/api/v1/auth/register", "/api/auth/login", "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/checkout", "/api/checkout").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/checkout/**", "/api/checkout/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/webhooks/payments/**", "/api/webhooks/payments/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers("/api/v1/admin/**", "/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(captchaVerificationFilter, JwtAuthenticationFilter.class)
                .addFilterBefore(rateLimitFilter, CaptchaVerificationFilter.class)
                .addFilterBefore(antiBotFilter, RateLimitFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(corsProperties.allowedOrigins());
        config.setAllowedMethods(corsProperties.allowedMethods());
        config.setAllowedHeaders(corsProperties.allowedHeaders());
        config.setExposedHeaders(corsProperties.exposedHeaders());
        config.setAllowCredentials(corsProperties.allowCredentials());
        config.setMaxAge(corsProperties.maxAgeSeconds());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
