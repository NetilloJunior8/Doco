package com.doco.catalog.dto.catalog;

import com.doco.catalog.domain.enums.GarmentCondition;
import com.doco.catalog.domain.enums.StyleEra;

import java.math.BigDecimal;
import java.util.List;

public record ProductDetailDto(
        Long id,
        String sku,
        String title,
        String slug,
        String description,
        BigDecimal priceMxn,
        BigDecimal compareAtPriceMxn,
        String sizeLabel,
        String measurements,
        StyleEra styleEra,
        GarmentCondition conditionGrade,
        int stock,
        String dropTag,
        boolean featured,
        CategoryDto category,
        BrandDto brand,
        List<ProductImageDto> images
) {
    public record ProductImageDto(String imageUrl, String altText, int sortOrder, boolean primaryImage) {}
}
