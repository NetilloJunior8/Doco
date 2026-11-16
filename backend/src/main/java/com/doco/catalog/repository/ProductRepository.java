package com.doco.catalog.repository;

import com.doco.catalog.domain.entity.Product;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    @EntityGraph(attributePaths = {"category", "brand", "images"})
    Optional<Product> findWithDetailsBySlug(String slug);

    boolean existsBySlug(String slug);

    boolean existsBySku(String sku);
}
