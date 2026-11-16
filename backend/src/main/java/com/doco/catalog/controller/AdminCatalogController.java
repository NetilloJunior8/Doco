package com.doco.catalog.controller;

import com.doco.catalog.dto.catalog.CreateProductRequest;
import com.doco.catalog.dto.catalog.ProductDetailDto;
import com.doco.catalog.service.CatalogService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/products")
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
public class AdminCatalogController {

    private final CatalogService catalogService;

    public AdminCatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @PostMapping
    public ResponseEntity<ProductDetailDto> createProduct(@Valid @RequestBody CreateProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createProduct(request));
    }

    @PatchMapping("/{productId}/stock")
    public ResponseEntity<ProductDetailDto> updateStock(
            @PathVariable Long productId,
            @RequestParam @Min(0) int stock
    ) {
        return ResponseEntity.ok(catalogService.updateStock(productId, stock));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deactivateProduct(@PathVariable Long productId) {
        catalogService.deactivateProduct(productId);
        return ResponseEntity.noContent().build();
    }
}
