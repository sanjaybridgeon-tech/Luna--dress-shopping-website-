/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.dto;

import com.luna.product.entity.Category;

/**
 * Immutable response DTO representing a clothing category.
 */
public record CategoryResponse(
        Long id,
        String name,
        String slug,
        String description,
        String imageUrl
) {
    public static CategoryResponse fromEntity(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl()
        );
    }
}
