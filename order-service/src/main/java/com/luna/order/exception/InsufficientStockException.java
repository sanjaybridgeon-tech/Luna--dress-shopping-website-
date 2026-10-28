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

public class InsufficientStockException extends RuntimeException {

    public InsufficientStockException(UUID variantId, int requestedQuantity) {
        super(String.format("Insufficient stock for dress variant %s (requested: %d)", variantId, requestedQuantity));
    }

    public InsufficientStockException(String message) {
        super(message);
    }
}
