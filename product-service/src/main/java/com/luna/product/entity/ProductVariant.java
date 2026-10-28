/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "product_variants")
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "size", nullable = false, length = 20)
    private String size;

    @Column(name = "color", nullable = false, length = 40)
    private String color;

    @Column(name = "sku", nullable = false, unique = true, length = 80)
    private String sku;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    protected ProductVariant() {
    }

    public ProductVariant(Product product, String size, String color, String sku, int stockQuantity) {
        this.product = Objects.requireNonNull(product, "Product cannot be null");
        this.size = Objects.requireNonNull(size, "Size cannot be null");
        this.color = Objects.requireNonNull(color, "Color cannot be null");
        this.sku = Objects.requireNonNull(sku, "SKU cannot be null");
        if (stockQuantity < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative");
        }
        this.stockQuantity = stockQuantity;
    }

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Domain methods
    public void update(String size, String color, String sku, int stockQuantity) {
        this.size = Objects.requireNonNull(size, "Size cannot be null");
        this.color = Objects.requireNonNull(color, "Color cannot be null");
        this.sku = Objects.requireNonNull(sku, "SKU cannot be null");
        if (stockQuantity < 0) {
            throw new IllegalArgumentException("Stock quantity cannot be negative");
        }
        this.stockQuantity = stockQuantity;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // Getters
    public UUID getId() {
        return id;
    }

    public Product getProduct() {
        return product;
    }

    public String getSize() {
        return size;
    }

    public String getColor() {
        return color;
    }

    public String getSku() {
        return sku;
    }

    public int getStockQuantity() {
        return stockQuantity;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProductVariant that)) return false;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
