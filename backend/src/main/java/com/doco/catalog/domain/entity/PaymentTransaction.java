package com.doco.catalog.domain.entity;

import com.doco.catalog.domain.enums.PaymentProviderType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "payment_transactions", indexes = {
        @Index(name = "idx_payment_tx_event_id", columnList = "provider_event_id", unique = true)
})
public class PaymentTransaction extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentProviderType provider;

    @Column(name = "provider_event_id", nullable = false, unique = true, length = 150)
    private String providerEventId;

    @Column(name = "amount_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal amountMxn;

    @Column(nullable = false, length = 10)
    private String currency = "MXN";

    @Column(nullable = false, length = 40)
    private String status;

    @Column(name = "payload_sha256", length = 64)
    private String payloadSha256;

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public PaymentProviderType getProvider() { return provider; }
    public void setProvider(PaymentProviderType provider) { this.provider = provider; }

    public String getProviderEventId() { return providerEventId; }
    public void setProviderEventId(String providerEventId) { this.providerEventId = providerEventId; }

    public BigDecimal getAmountMxn() { return amountMxn; }
    public void setAmountMxn(BigDecimal amountMxn) { this.amountMxn = amountMxn; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPayloadSha256() { return payloadSha256; }
    public void setPayloadSha256(String payloadSha256) { this.payloadSha256 = payloadSha256; }
}
