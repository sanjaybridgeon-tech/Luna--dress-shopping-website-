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
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        String brand,
        Gender gender,
        CategoryResponse category,
        String imageUrl,
        boolean active,
        List<String> availableSizes,
        List<String> availableColors,
        int totalStock,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
}
