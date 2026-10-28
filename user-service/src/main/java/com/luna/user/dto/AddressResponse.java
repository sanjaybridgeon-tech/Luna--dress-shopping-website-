/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.user.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record AddressResponse(
        UUID id,
        String line1,
        String line2,
        String city,
        String state,
        String postalCode,
        String country,
        boolean isDefault,
        OffsetDateTime createdAt
) {}
