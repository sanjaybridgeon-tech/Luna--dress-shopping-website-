/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.dto;

import com.luna.product.entity.ProductVariant;
import java.math.BigDecimal;
import java.util.UUID;

public record VariantResponse(
        UUID id,
        UUID productId,
        String productName,
        BigDecimal price,
        String size,
        String color,
        String sku,
        int stockQuantity
) {
    public static VariantResponse fromEntity(ProductVariant variant) {
        if (variant == null) {
            return null;
        }
        return new VariantResponse(
                variant.getId(),
                variant.getProduct() != null ? variant.getProduct().getId() : null,
                variant.getProduct() != null ? variant.getProduct().getName() : null,
                variant.getProduct() != null ? variant.getProduct().getPrice() : null,
                variant.getSize(),
                variant.getColor(),
                variant.getSku(),
                variant.getStockQuantity()
        );
    }
}
