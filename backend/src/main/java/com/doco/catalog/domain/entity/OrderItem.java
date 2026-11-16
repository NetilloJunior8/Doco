package com.doco.catalog.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
public class OrderItem extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "sku_snapshot", nullable = false, length = 50)
    private String skuSnapshot;

    @Column(name = "title_snapshot", nullable = false, length = 150)
    private String titleSnapshot;

    @Column(name = "unit_price_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPriceMxn;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "line_total_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal lineTotalMxn;

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getSkuSnapshot() { return skuSnapshot; }
    public void setSkuSnapshot(String skuSnapshot) { this.skuSnapshot = skuSnapshot; }

    public String getTitleSnapshot() { return titleSnapshot; }
    public void setTitleSnapshot(String titleSnapshot) { this.titleSnapshot = titleSnapshot; }

    public BigDecimal getUnitPriceMxn() { return unitPriceMxn; }
    public void setUnitPriceMxn(BigDecimal unitPriceMxn) { this.unitPriceMxn = unitPriceMxn; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public BigDecimal getLineTotalMxn() { return lineTotalMxn; }
    public void setLineTotalMxn(BigDecimal lineTotalMxn) { this.lineTotalMxn = lineTotalMxn; }
}
