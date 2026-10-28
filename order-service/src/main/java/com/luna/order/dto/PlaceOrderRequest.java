/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PlaceOrderRequest(
        @NotEmpty(message = "Order must contain at least one item")
        @Valid
        List<OrderItemRequest> items,

        @NotBlank(message = "Shipping address is required")
        @Size(max = 500, message = "Shipping address cannot exceed 500 characters")
        String shippingAddressLine,

        @NotBlank(message = "Recipient name is required")
        @Size(max = 100, message = "Recipient name cannot exceed 100 characters")
        String recipientName,

        @Size(max = 30, message = "Recipient phone cannot exceed 30 characters")
        String recipientPhone
) {}
