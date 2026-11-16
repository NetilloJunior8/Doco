package com.doco.catalog.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "product_images")
public class ProductImage extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(name = "alt_text", length = 200)
    private String altText;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder = 0;

    @Column(name = "primary_image", nullable = false)
    private boolean primaryImage = false;

    public ProductImage() {}

    public ProductImage(Product product, String imageUrl, String altText, int sortOrder, boolean primaryImage) {
        this.product = product;
        this.imageUrl = imageUrl;
        this.altText = altText;
        this.sortOrder = sortOrder;
        this.primaryImage = primaryImage;
    }

    public Product getProduct() { return product; }
    public String getImageUrl() { return imageUrl; }
    public String getAltText() { return altText; }
    public int getSortOrder() { return sortOrder; }
    public boolean isPrimaryImage() { return primaryImage; }
}
