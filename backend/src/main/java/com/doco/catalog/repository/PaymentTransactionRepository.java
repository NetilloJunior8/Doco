package com.doco.catalog.repository;

import com.doco.catalog.domain.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {
    boolean existsByProviderEventId(String providerEventId);
}
