package com.doco.catalog.service;

import com.doco.catalog.domain.entity.Brand;
import com.doco.catalog.domain.entity.Category;
import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.dto.catalog.BrandDto;
import com.doco.catalog.dto.catalog.CategoryDto;
import com.doco.catalog.dto.catalog.CreateProductRequest;
import com.doco.catalog.dto.catalog.ProductDetailDto;
import com.doco.catalog.dto.catalog.ProductFilterRequest;
import com.doco.catalog.dto.catalog.ProductSummaryDto;
import com.doco.catalog.dto.common.PageResponse;
import com.doco.catalog.exception.BusinessConflictException;
import com.doco.catalog.exception.ResourceNotFoundException;
import com.doco.catalog.mapper.CatalogMapper;
import com.doco.catalog.repository.BrandRepository;
import com.doco.catalog.repository.CategoryRepository;
import com.doco.catalog.repository.ProductRepository;
import com.doco.catalog.repository.ProductSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
public class CatalogService {

    private static final Map<String, Sort> SORT_STRATEGIES = Map.of(
            "newest", Sort.by(Sort.Direction.DESC, "createdAt"),
            "price_asc", Sort.by(Sort.Direction.ASC, "priceMxn"),
            "price_desc", Sort.by(Sort.Direction.DESC, "priceMxn"),
            "featured", Sort.by(Sort.Order.desc("featured"), Sort.Order.desc("createdAt"))
    );

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final CatalogMapper mapper;

    public CatalogService(
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            ProductRepository productRepository,
            CatalogMapper mapper
    ) {
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> listActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByDisplayOrderAscNameAsc()
                .stream()
                .map(mapper::toCategoryDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<BrandDto> listBrands() {
        return brandRepository.findAllByOrderByFeaturedDescNameAsc()
                .stream()
                .map(mapper::toBrandDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductSummaryDto> searchProducts(
            ProductFilterRequest filter,
            int page,
            int size,
            String sortKey
    ) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(48, Math.max(1, size));
        Sort sort = SORT_STRATEGIES.getOrDefault(sortKey == null ? "featured" : sortKey, SORT_STRATEGIES.get("featured"));
        Pageable pageable = PageRequest.of(safePage, safeSize, sort);

        Page<ProductSummaryDto> result = productRepository
                .findAll(ProductSpecifications.fromFilter(filter, true), pageable)
                .map(mapper::toProductSummary);

        return PageResponse.from(result);
    }

    @Transactional(readOnly = true)
    public ProductDetailDto getProductBySlug(String slug) {
        Product product = productRepository.findWithDetailsBySlug(slug)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Pieza no encontrada: " + slug));
        return mapper.toProductDetail(product);
    }

    @Transactional
    public ProductDetailDto createProduct(CreateProductRequest request) {
        String normalizedSku = request.sku().trim().toUpperCase();
        if (productRepository.existsBySku(normalizedSku)) {
            throw new BusinessConflictException("Ya existe una pieza con SKU " + normalizedSku);
        }

        String baseSlug = SlugUtils.toSlug(request.title() + "-" + normalizedSku);
        String slug = productRepository.existsBySlug(baseSlug)
                ? baseSlug + "-" + System.currentTimeMillis()
                : baseSlug;

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada."));
        Brand brand = brandRepository.findById(request.brandId())
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada."));

        Product product = new Product();
        product.setSku(normalizedSku);
        product.setTitle(request.title().trim());
        product.setSlug(slug);
        product.setDescription(request.description().trim());
        product.setPriceMxn(request.priceMxn());
        product.setCompareAtPriceMxn(request.compareAtPriceMxn());
        product.setSizeLabel(request.sizeLabel().trim().toUpperCase());
        product.setMeasurements(request.measurements());
        product.setStyleEra(request.styleEra());
        product.setConditionGrade(request.conditionGrade());
        product.setStock(request.stock());
        product.setDropTag(request.dropTag());
        product.setFeatured(request.featured());
        product.setCategory(category);
        product.setBrand(brand);

        for (int i = 0; i < request.imageUrls().size(); i++) {
            product.addImage(request.imageUrls().get(i).trim(), product.getTitle(), i, i == 0);
        }

        Product saved = productRepository.save(product);
        return mapper.toProductDetail(saved);
    }

    @Transactional
    public ProductDetailDto updateStock(Long productId, int stock) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Pieza no encontrada."));
        product.setStock(Math.max(0, stock));
        return mapper.toProductDetail(productRepository.save(product));
    }

    @Transactional
    public void deactivateProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Pieza no encontrada."));
        product.setActive(false);
        productRepository.save(product);
    }
}
