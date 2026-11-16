package com.doco.catalog.dto.catalog;

import com.doco.catalog.domain.enums.GarmentCondition;
import com.doco.catalog.domain.enums.StyleEra;

import java.math.BigDecimal;

public record ProductSummaryDto(
        Long id,
        String sku,
        String title,
        String slug,
        BigDecimal priceMxn,
        BigDecimal compareAtPriceMxn,
        String sizeLabel,
        StyleEra styleEra,
        GarmentCondition conditionGrade,
        int stock,
        String dropTag,
        boolean featured,
        String categoryName,
        String categorySlug,
        String brandName,
        String brandSlug,
        String primaryImageUrl
) {
}
