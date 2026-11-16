package com.doco.catalog.repository;

import com.doco.catalog.domain.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByActiveTrueOrderByDisplayOrderAscNameAsc();
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
