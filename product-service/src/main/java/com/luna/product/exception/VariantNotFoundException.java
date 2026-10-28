/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.exception;

import java.util.UUID;

public class VariantNotFoundException extends RuntimeException {
    public VariantNotFoundException(UUID id) {
        super("Product variant not found with ID: " + id);
    }
}
