package com.doco.catalog.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI docoOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("DOCO Archival Catalog & Commerce API")
                        .version("v1")
                        .description("API en capas para catálogo Vintage / Streetwear / Y2K, seguridad anti-bot y pagos MX.")
                        .contact(new Contact().name("DOCO").url("https://instagram.com/doco.tm")))
                .components(new Components().addSecuritySchemes("bearerAuth",
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
