package com.doco.catalog.mapper;

import com.doco.catalog.domain.entity.Brand;
import com.doco.catalog.domain.entity.Category;
import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.domain.entity.ProductImage;
import com.doco.catalog.dto.catalog.BrandDto;
import com.doco.catalog.dto.catalog.CategoryDto;
import com.doco.catalog.dto.catalog.ProductDetailDto;
import com.doco.catalog.dto.catalog.ProductSummaryDto;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;

/**
 * Centralized mapping layer ensuring consistent DTO projection without duplicated mapping logic.
 */
@Component
public class CatalogMapper {

    public CategoryDto toCategoryDto(Category category) {
        return new CategoryDto(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getDisplayOrder()
        );
    }

    public BrandDto toBrandDto(Brand brand) {
        return new BrandDto(
                brand.getId(),
                brand.getName(),
                brand.getSlug(),
                brand.getOriginCountry(),
                brand.isFeatured()
        );
    }

    public ProductSummaryDto toProductSummary(Product product) {
        String primaryImage = product.getImages().stream()
                .filter(ProductImage::isPrimaryImage)
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElseGet(() -> product.getImages().stream()
                        .min(Comparator.comparingInt(ProductImage::getSortOrder))
                        .map(ProductImage::getImageUrl)
                        .orElse(null));

        return new ProductSummaryDto(
                product.getId(),
                product.getSku(),
                product.getTitle(),
                product.getSlug(),
                product.getPriceMxn(),
                product.getCompareAtPriceMxn(),
                product.getSizeLabel(),
                product.getStyleEra(),
                product.getConditionGrade(),
                product.getStock(),
                product.getDropTag(),
                product.isFeatured(),
                product.getCategory().getName(),
                product.getCategory().getSlug(),
                product.getBrand().getName(),
                product.getBrand().getSlug(),
                primaryImage
        );
    }

    public ProductDetailDto toProductDetail(Product product) {
        List<ProductDetailDto.ProductImageDto> images = product.getImages().stream()
                .sorted(Comparator.comparingInt(ProductImage::getSortOrder))
                .map(img -> new ProductDetailDto.ProductImageDto(
                        img.getImageUrl(),
                        img.getAltText(),
                        img.getSortOrder(),
                        img.isPrimaryImage()
                ))
                .toList();

        return new ProductDetailDto(
                product.getId(),
                product.getSku(),
                product.getTitle(),
                product.getSlug(),
                product.getDescription(),
                product.getPriceMxn(),
                product.getCompareAtPriceMxn(),
                product.getSizeLabel(),
                product.getMeasurements(),
                product.getStyleEra(),
                product.getConditionGrade(),
                product.getStock(),
                product.getDropTag(),
                product.isFeatured(),
                toCategoryDto(product.getCategory()),
                toBrandDto(product.getBrand()),
                images
        );
    }
}
