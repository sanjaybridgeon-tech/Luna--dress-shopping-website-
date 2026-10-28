/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.client;

import com.luna.order.exception.InsufficientStockException;
import com.luna.order.exception.ProductServiceUnavailableException;
import com.luna.order.exception.VariantNotFoundException;
import feign.Response;
import feign.codec.ErrorDecoder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class ProductServiceErrorDecoder implements ErrorDecoder {

    private final ErrorDecoder defaultDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == 404) {
            return new VariantNotFoundException(UUID.fromString("00000000-0000-0000-0000-000000000000"));
        }
        if (response.status() == 409) {
            return new InsufficientStockException("Insufficient stock available for the requested dress variant");
        }
        if (response.status() >= 500) {
            return new ProductServiceUnavailableException("Product Service is currently unavailable");
        }
        return defaultDecoder.decode(methodKey, response);
    }
}
