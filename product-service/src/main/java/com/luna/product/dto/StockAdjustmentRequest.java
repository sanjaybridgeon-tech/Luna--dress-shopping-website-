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
import jakarta.validation.constraints.Pattern;

public record StockAdjustmentRequest(
        @Min(value = 1, message = "Adjustment quantity must be at least 1")
        int quantity,

        @NotBlank(message = "Adjustment type is required")
        @Pattern(regexp = "INCREMENT|DECREMENT", message = "Adjustment type must be either INCREMENT or DECREMENT")
        String adjustmentType
) {
}
