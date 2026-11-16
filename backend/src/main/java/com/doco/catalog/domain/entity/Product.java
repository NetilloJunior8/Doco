package com.doco.catalog.domain.entity;

import com.doco.catalog.domain.enums.GarmentCondition;
import com.doco.catalog.domain.enums.StyleEra;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_products_slug", columnList = "slug", unique = true),
        @Index(name = "idx_products_sku", columnList = "sku", unique = true),
        @Index(name = "idx_products_active_era", columnList = "active, style_era"),
        @Index(name = "idx_products_category", columnList = "category_id"),
        @Index(name = "idx_products_brand", columnList = "brand_id")
})
public class Product extends BaseAuditableEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, unique = true, length = 170)
    private String slug;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "price_mxn", nullable = false, precision = 12, scale = 2)
    private BigDecimal priceMxn;

    @Column(name = "compare_at_price_mxn", precision = 12, scale = 2)
    private BigDecimal compareAtPriceMxn;

    @Column(name = "size_label", nullable = false, length = 30)
    private String sizeLabel;

    @Column(length = 180)
    private String measurements;

    @Enumerated(EnumType.STRING)
    @Column(name = "style_era", nullable = false, length = 30)
    private StyleEra styleEra;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_grade", nullable = false, length = 30)
    private GarmentCondition conditionGrade;

    @Column(nullable = false)
    private Integer stock = 1;

    @Column(name = "drop_tag", length = 40)
    private String dropTag;

    @Column(nullable = false)
    private boolean featured = false;

    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @org.hibernate.annotations.BatchSize(size = 24)
    private List<ProductImage> images = new ArrayList<>();

    public void addImage(String imageUrl, String altText, int sortOrder, boolean primary) {
        ProductImage img = new ProductImage(this, imageUrl, altText, sortOrder, primary);
        this.images.add(img);
    }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPriceMxn() { return priceMxn; }
    public void setPriceMxn(BigDecimal priceMxn) { this.priceMxn = priceMxn; }

    public BigDecimal getCompareAtPriceMxn() { return compareAtPriceMxn; }
    public void setCompareAtPriceMxn(BigDecimal compareAtPriceMxn) { this.compareAtPriceMxn = compareAtPriceMxn; }

    public String getSizeLabel() { return sizeLabel; }
    public void setSizeLabel(String sizeLabel) { this.sizeLabel = sizeLabel; }

    public String getMeasurements() { return measurements; }
    public void setMeasurements(String measurements) { this.measurements = measurements; }

    public StyleEra getStyleEra() { return styleEra; }
    public void setStyleEra(StyleEra styleEra) { this.styleEra = styleEra; }

    public GarmentCondition getConditionGrade() { return conditionGrade; }
    public void setConditionGrade(GarmentCondition conditionGrade) { this.conditionGrade = conditionGrade; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public String getDropTag() { return dropTag; }
    public void setDropTag(String dropTag) { this.dropTag = dropTag; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public Brand getBrand() { return brand; }
    public void setBrand(Brand brand) { this.brand = brand; }

    public List<ProductImage> getImages() { return images; }
}
