package com.doco.catalog.controller;

import com.doco.catalog.domain.enums.StyleEra;
import com.doco.catalog.dto.catalog.BrandDto;
import com.doco.catalog.dto.catalog.CategoryDto;
import com.doco.catalog.dto.catalog.ProductDetailDto;
import com.doco.catalog.dto.catalog.ProductFilterRequest;
import com.doco.catalog.dto.catalog.ProductSummaryDto;
import com.doco.catalog.dto.common.PageResponse;
import com.doco.catalog.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> listCategories() {
        return ResponseEntity.ok(catalogService.listActiveCategories());
    }

    @GetMapping("/brands")
    public ResponseEntity<List<BrandDto>> listBrands() {
        return ResponseEntity.ok(catalogService.listBrands());
    }

    @GetMapping("/products")
    public ResponseEntity<PageResponse<ProductSummaryDto>> listProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) StyleEra era,
            @RequestParam(required = false) String size,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(required = false) Boolean featuredOnly,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int pageSize,
            @RequestParam(defaultValue = "featured") String sort
    ) {
        ProductFilterRequest filter = new ProductFilterRequest(
                category, brand, era, size, minPrice, maxPrice, inStockOnly, featuredOnly, search
        );
        return ResponseEntity.ok(catalogService.searchProducts(filter, page, pageSize, sort));
    }

    @GetMapping("/products/{slug}")
    public ResponseEntity<ProductDetailDto> getProduct(@PathVariable String slug) {
        return ResponseEntity.ok(catalogService.getProductBySlug(slug));
    }
}
