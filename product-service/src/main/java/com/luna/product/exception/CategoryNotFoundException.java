/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.exception;

public class CategoryNotFoundException extends RuntimeException {
    public CategoryNotFoundException(String slug) {
        super("Category not found with slug: " + slug);
    }

    public CategoryNotFoundException(Long id) {
        super("Category not found with ID: " + id);
    }
}
