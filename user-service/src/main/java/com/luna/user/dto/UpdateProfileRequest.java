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

public record UpdateProfileRequest(
        @NotBlank(message = "Name cannot be blank")
        @Size(max = 100, message = "Name must not exceed 100 characters")
        String name,

        @Size(max = 30, message = "Phone must not exceed 30 characters")
        String phone
) {}
