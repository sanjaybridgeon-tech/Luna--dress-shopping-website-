/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.client.dto;

public record StockAdjustmentRequest(
        int quantity,
        String adjustmentType
) {
    public static StockAdjustmentRequest decrement(int quantity) {
        return new StockAdjustmentRequest(quantity, "DECREMENT");
    }

    public static StockAdjustmentRequest increment(int quantity) {
        return new StockAdjustmentRequest(quantity, "INCREMENT");
    }
}
