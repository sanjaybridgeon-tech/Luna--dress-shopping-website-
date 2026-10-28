/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.controller;

import com.luna.product.dto.*;
import com.luna.product.entity.Gender;
import com.luna.product.service.ProductService;
import com.luna.product.service.VariantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Catalog", description = "Endpoints for dress catalog, search, and variants")
public class ProductController {

    private final ProductService productService;
    private final VariantService variantService;

    public ProductController(ProductService productService, VariantService variantService) {
        this.productService = productService;
        this.variantService = variantService;
    }

    @GetMapping
    @Operation(summary = "Search and filter products", description = "List dresses with multi-criteria dynamic filtering and pagination")
    public ResponseEntity<Page<ProductResponse>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 12, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ProductResponse> products = productService.list(search, category, gender, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieves full product details including variants")
    public ResponseEntity<ProductDetailResponse> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    @Operation(summary = "Create product", description = "Creates a new dress product with optional variants")
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        ProductResponse created = productService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update product", description = "Updates an existing product's details")
    public ResponseEntity<ProductResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductRequest request
    ) {
        return ResponseEntity.ok(productService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate product", description = "Soft-deletes a product by setting active to false")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        productService.deactivate(id);
        return ResponseEntity.noContent().build();
    }

    // Variant endpoints
    @GetMapping("/{id}/variants")
    @Operation(summary = "List variants by product", description = "Retrieves all size/color variants for a specific product")
    public ResponseEntity<List<VariantResponse>> listVariants(@PathVariable UUID id) {
        return ResponseEntity.ok(variantService.listVariants(id));
    }

    @PostMapping("/{id}/variants")
    @Operation(summary = "Add variant to product", description = "Creates a new size/color variant for an existing product")
    public ResponseEntity<VariantResponse> addVariant(
            @PathVariable UUID id,
            @Valid @RequestBody VariantRequest request
    ) {
        VariantResponse created = variantService.addVariant(id, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/variants/{variantId}")
    @Operation(summary = "Get variant by ID", description = "Retrieves variant details by variant UUID")
    public ResponseEntity<VariantResponse> getVariant(@PathVariable UUID variantId) {
        return ResponseEntity.ok(variantService.getVariant(variantId));
    }

    @PatchMapping("/variants/{variantId}/stock")
    @Operation(summary = "Adjust variant stock", description = "Atomically increments or decrements inventory stock")
    public ResponseEntity<VariantResponse> adjustStock(
            @PathVariable UUID variantId,
            @Valid @RequestBody StockAdjustmentRequest request
    ) {
        return ResponseEntity.ok(variantService.adjustStock(variantId, request));
    }
}
