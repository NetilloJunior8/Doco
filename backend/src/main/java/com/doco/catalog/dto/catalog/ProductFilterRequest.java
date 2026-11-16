package com.doco.catalog.dto.catalog;

import com.doco.catalog.domain.enums.StyleEra;

import java.math.BigDecimal;

public record ProductFilterRequest(
        String categorySlug,
        String brandSlug,
        StyleEra styleEra,
        String size,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Boolean inStockOnly,
        Boolean featuredOnly,
        String search
) {
}
