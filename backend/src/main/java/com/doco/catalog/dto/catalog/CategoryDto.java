package com.doco.catalog.dto.catalog;

public record CategoryDto(
        Long id,
        String name,
        String slug,
        String description,
        String imageUrl,
        int displayOrder
) {
}
