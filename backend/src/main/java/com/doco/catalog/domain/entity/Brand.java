package com.doco.catalog.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;

@Entity
@Table(name = "brands", indexes = {
        @Index(name = "idx_brands_slug", columnList = "slug", unique = true)
})
public class Brand extends BaseAuditableEntity {

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    @Column(name = "origin_country", length = 60)
    private String originCountry;

    @Column(nullable = false)
    private boolean featured = false;

    public Brand() {}

    public Brand(String name, String slug, String originCountry, boolean featured) {
        this.name = name;
        this.slug = slug;
        this.originCountry = originCountry;
        this.featured = featured;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getOriginCountry() { return originCountry; }
    public void setOriginCountry(String originCountry) { this.originCountry = originCountry; }

    public boolean isFeatured() { return featured; }
    public void setFeatured(boolean featured) { this.featured = featured; }
}
