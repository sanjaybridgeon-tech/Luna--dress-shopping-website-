/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.client;

import com.luna.order.client.dto.StockAdjustmentRequest;
import com.luna.order.client.dto.VariantDetailResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.UUID;

@FeignClient(
        name = "product-service",
        url = "${services.product-service.url:http://localhost:8082}"
)
public interface ProductServiceClient {

    @GetMapping("/api/products/variants/{variantId}")
    VariantDetailResponse getVariant(@PathVariable("variantId") UUID variantId);

    @PatchMapping("/api/products/variants/{variantId}/stock")
    VariantDetailResponse adjustStock(
            @PathVariable("variantId") UUID variantId,
            @RequestBody StockAdjustmentRequest request
    );
}
