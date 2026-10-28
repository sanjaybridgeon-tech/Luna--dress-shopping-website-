/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.exception;

import java.util.UUID;

public class VariantNotFoundException extends RuntimeException {

    public VariantNotFoundException(UUID variantId) {
        super("Product variant not found with id: " + variantId);
    }
}
