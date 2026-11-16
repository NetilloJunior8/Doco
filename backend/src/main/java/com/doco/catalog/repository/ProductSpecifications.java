package com.doco.catalog.repository;

import com.doco.catalog.domain.entity.Product;
import com.doco.catalog.dto.catalog.ProductFilterRequest;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.criteria.Predicate;

/**
 * Composable JPA Specifications for dynamic catalog filtering without duplicating repository methods.
 */
public final class ProductSpecifications {

    private ProductSpecifications() {}

    public static Specification<Product> fromFilter(ProductFilterRequest filter, boolean activeOnly) {
        return (root, query, cb) -> {
            if (query.getResultType() != Long.class && query.getResultType() != long.class) {
                root.fetch("category", JoinType.LEFT);
                root.fetch("brand", JoinType.LEFT);
            }

            List<Predicate> predicates = new ArrayList<>();

            if (activeOnly) {
                predicates.add(cb.isTrue(root.get("active")));
            }
            if (hasText(filter.categorySlug())) {
                predicates.add(cb.equal(root.get("category").get("slug"), filter.categorySlug().trim().toLowerCase()));
            }
            if (hasText(filter.brandSlug())) {
                predicates.add(cb.equal(root.get("brand").get("slug"), filter.brandSlug().trim().toLowerCase()));
            }
            if (filter.styleEra() != null) {
                predicates.add(cb.equal(root.get("styleEra"), filter.styleEra()));
            }
            if (hasText(filter.size())) {
                predicates.add(cb.equal(cb.upper(root.get("sizeLabel")), filter.size().trim().toUpperCase()));
            }
            if (filter.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("priceMxn"), filter.minPrice()));
            }
            if (filter.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("priceMxn"), filter.maxPrice()));
            }
            if (Boolean.TRUE.equals(filter.inStockOnly())) {
                predicates.add(cb.greaterThan(root.get("stock"), 0));
            }
            if (Boolean.TRUE.equals(filter.featuredOnly())) {
                predicates.add(cb.isTrue(root.get("featured")));
            }
            if (hasText(filter.search())) {
                String pattern = "%" + filter.search().trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern),
                        cb.like(cb.lower(root.get("sku")), pattern),
                        cb.like(cb.lower(root.get("brand").get("name")), pattern)
                ));
            }

            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
