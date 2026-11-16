package com.doco.catalog.repository;

import com.doco.catalog.domain.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByOrderNumber(String orderNumber);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Optional<Order> findByIdempotencyKey(String idempotencyKey);

    Optional<Order> findByExternalReference(String externalReference);
}
