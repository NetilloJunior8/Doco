package com.doco.catalog.dto.catalog;

public record BrandDto(
        Long id,
        String name,
        String slug,
        String originCountry,
        boolean featured
) {
}
