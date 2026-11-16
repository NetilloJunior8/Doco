package com.doco.catalog.repository;

import com.doco.catalog.domain.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    List<Brand> findAllByOrderByFeaturedDescNameAsc();
    Optional<Brand> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
