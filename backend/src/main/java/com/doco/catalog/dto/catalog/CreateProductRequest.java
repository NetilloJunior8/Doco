package com.doco.catalog.dto.catalog;

import com.doco.catalog.domain.enums.GarmentCondition;
import com.doco.catalog.domain.enums.StyleEra;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record CreateProductRequest(
        @NotBlank @Size(max = 50) String sku,
        @NotBlank @Size(max = 150) String title,
        @NotBlank @Size(max = 2000) String description,
        @NotNull @DecimalMin("1.00") BigDecimal priceMxn,
        @DecimalMin("1.00") BigDecimal compareAtPriceMxn,
        @NotBlank @Size(max = 30) String sizeLabel,
        @Size(max = 180) String measurements,
        @NotNull StyleEra styleEra,
        @NotNull GarmentCondition conditionGrade,
        @NotNull @Min(0) Integer stock,
        @Size(max = 40) String dropTag,
        boolean featured,
        @NotNull Long categoryId,
        @NotNull Long brandId,
        @NotEmpty List<@NotBlank String> imageUrls
) {
}
