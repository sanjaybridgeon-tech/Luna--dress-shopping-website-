/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record VariantRequest(
        @NotBlank(message = "Size is required")
        @Size(max = 20, message = "Size cannot exceed 20 characters")
        String size,

        @NotBlank(message = "Color is required")
        @Size(max = 40, message = "Color cannot exceed 40 characters")
        String color,

        @NotBlank(message = "SKU is required")
        @Size(max = 80, message = "SKU cannot exceed 80 characters")
        String sku,

        @Min(value = 0, message = "Stock quantity cannot be negative")
        int stockQuantity
) {
}
