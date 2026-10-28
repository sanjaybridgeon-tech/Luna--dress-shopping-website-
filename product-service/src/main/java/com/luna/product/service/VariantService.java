/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.service;

import com.luna.product.dto.StockAdjustmentRequest;
import com.luna.product.dto.VariantRequest;
import com.luna.product.dto.VariantResponse;
import com.luna.product.entity.Product;
import com.luna.product.entity.ProductVariant;
import com.luna.product.exception.InsufficientStockException;
import com.luna.product.exception.ProductNotFoundException;
import com.luna.product.exception.VariantNotFoundException;
import com.luna.product.repository.ProductRepository;
import com.luna.product.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class VariantService {

    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;

    public VariantService(ProductVariantRepository variantRepository, ProductRepository productRepository) {
        this.variantRepository = variantRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public VariantResponse addVariant(UUID productId, VariantRequest request) {
        Product product = productRepository.findByIdAndActiveTrue(productId)
                .orElseThrow(() -> new ProductNotFoundException(productId));

        ProductVariant variant = toVariantEntity(request, product);
        product.addVariant(variant);
        ProductVariant saved = variantRepository.save(variant);
        return toVariantResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<VariantResponse> listVariants(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new ProductNotFoundException(productId);
        }
        return variantRepository.findByProductId(productId)
                .stream()
                .map(this::toVariantResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VariantResponse getVariant(UUID variantId) {
        return variantRepository.findById(variantId)
                .map(this::toVariantResponse)
                .orElseThrow(() -> new VariantNotFoundException(variantId));
    }

    @Transactional
    public VariantResponse adjustStock(UUID variantId, StockAdjustmentRequest request) {
        ProductVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new VariantNotFoundException(variantId));

        if ("DECREMENT".equalsIgnoreCase(request.adjustmentType())) {
            int updated = variantRepository.decrementStock(variantId, request.quantity());
            if (updated == 0) {
                throw new InsufficientStockException(variantId, request.quantity(), variant.getStockQuantity());
            }
        } else if ("INCREMENT".equalsIgnoreCase(request.adjustmentType())) {
            variantRepository.addStock(variantId, request.quantity());
        } else {
            throw new IllegalArgumentException("Unknown adjustment type: " + request.adjustmentType());
        }

        // Reload updated entity
        ProductVariant refreshed = variantRepository.findById(variantId)
                .orElseThrow(() -> new VariantNotFoundException(variantId));

        return toVariantResponse(refreshed);
    }

    // In-service Entity-to-DTO mappings
    public VariantResponse toVariantResponse(ProductVariant variant) {
        if (variant == null) {
            return null;
        }
        return new VariantResponse(
                variant.getId(),
                variant.getProduct() != null ? variant.getProduct().getId() : null,
                variant.getProduct() != null ? variant.getProduct().getName() : null,
                variant.getProduct() != null ? variant.getProduct().getPrice() : null,
                variant.getSize(),
                variant.getColor(),
                variant.getSku(),
                variant.getStockQuantity()
        );
    }

    public ProductVariant toVariantEntity(VariantRequest request, Product product) {
        if (request == null) {
            return null;
        }
        return new ProductVariant(
                product,
                request.size().trim().toUpperCase(),
                request.color().trim(),
                request.sku().trim().toUpperCase(),
                request.stockQuantity()
        );
    }
}
