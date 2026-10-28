/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.client.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record VariantDetailResponse(
        UUID id,
        UUID productId,
        String productName,
        BigDecimal price,
        String size,
        String color,
        String sku,
        int stockQuantity
) {}
