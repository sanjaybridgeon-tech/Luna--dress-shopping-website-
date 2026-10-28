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

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(UUID variantId, int requestedQty, int availableQty) {
        super(String.format("Insufficient stock for variant ID %s. Requested: %d, Available: %d",
                variantId, requestedQty, availableQty));
    }

    public InsufficientStockException(String message) {
        super(message);
    }
}
