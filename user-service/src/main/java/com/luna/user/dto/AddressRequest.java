/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AddressRequest(
        @NotBlank(message = "Street address line 1 is required")
        @Size(max = 255, message = "Line 1 must not exceed 255 characters")
        String line1,

        @Size(max = 255, message = "Line 2 must not exceed 255 characters")
        String line2,

        @NotBlank(message = "City is required")
        @Size(max = 100, message = "City must not exceed 100 characters")
        String city,

        @NotBlank(message = "State is required")
        @Size(max = 100, message = "State must not exceed 100 characters")
        String state,

        @NotBlank(message = "Postal code is required")
        @Size(max = 20, message = "Postal code must not exceed 20 characters")
        String postalCode,

        @Size(max = 100, message = "Country must not exceed 100 characters")
        String country,

        Boolean isDefault
) {}
