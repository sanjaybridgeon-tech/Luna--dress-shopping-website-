/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.dto;

import com.luna.product.entity.Gender;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        @Size(max = 150, message = "Product name cannot exceed 150 characters")
        String name,

        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0.00")
        BigDecimal price,

        @Size(max = 80, message = "Brand cannot exceed 80 characters")
        String brand,

        @NotNull(message = "Gender is required (MEN, WOMEN, or UNISEX)")
        Gender gender,

        String categorySlug,

        Long categoryId,

        @Size(max = 1000, message = "Image URL cannot exceed 1000 characters")
        String imageUrl,

        @Valid
        List<VariantRequest> variants
) {
    public ProductRequest {
        if (brand == null || brand.isBlank()) {
            brand = "Luna";
        }
        if (variants == null) {
            variants = List.of();
        }
    }
}
