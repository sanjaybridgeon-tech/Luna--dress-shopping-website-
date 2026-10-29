/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.service;

import com.luna.product.dto.*;
import com.luna.product.entity.Category;
import com.luna.product.entity.Gender;
import com.luna.product.entity.Product;
import com.luna.product.entity.ProductVariant;
import com.luna.product.exception.CategoryNotFoundException;
import com.luna.product.exception.ProductNotFoundException;
import com.luna.product.repository.CategoryRepository;
import com.luna.product.repository.ProductRepository;
import com.luna.product.repository.ProductSpecifications;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final VariantService variantService;

    public ProductService(
            ProductRepository productRepository,
            CategoryRepository categoryRepository,
            VariantService variantService
    ) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.variantService = variantService;
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Category category = resolveCategory(request);

        Product product = Product.create(
                request.name().trim(),
                request.description(),
                request.price(),
                request.brand(),
                request.gender(),
                category,
                request.imageUrl()
        );

        if (request.variants() != null && !request.variants().isEmpty()) {
            for (var variantReq : request.variants()) {
                ProductVariant variant = variantService.toVariantEntity(variantReq, product);
                product.addVariant(variant);
            }
        }

        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> list(
            String search,
            String categorySlug,
            Gender gender,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable
    ) {
        Specification<Product> spec = Specification.where(ProductSpecifications.isActive());

        if (search != null && !search.isBlank()) {
            spec = spec.and(ProductSpecifications.hasSearch(search));
        }
        if (categorySlug != null && !categorySlug.isBlank()) {
            spec = spec.and(ProductSpecifications.hasCategorySlug(categorySlug));
        }
        if (gender != null) {
            spec = spec.and(ProductSpecifications.hasGender(gender));
        }
        if (minPrice != null) {
            spec = spec.and(ProductSpecifications.priceGreaterThanOrEqualTo(minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and(ProductSpecifications.priceLessThanOrEqualTo(maxPrice));
        }

        return productRepository.findAll(spec, pageable)
                .map(this::toProductResponse);
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getById(UUID id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        return toProductDetailResponse(product);
    }

    @Transactional
    public ProductResponse update(UUID id, ProductRequest request) {
        Product product = productRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() -> new ProductNotFoundException(id));

        Category category = resolveCategory(request);

        product.update(
                request.name().trim(),
                request.description(),
                request.price(),
                request.brand(),
                request.gender(),
                category,
                request.imageUrl()
        );

        Product saved = productRepository.save(product);
        return toProductResponse(saved);
    }

    private Category resolveCategory(ProductRequest request) {
        if (request.categorySlug() != null && !request.categorySlug().isBlank()) {
            var cat = categoryRepository.findBySlug(request.categorySlug().trim());
            if (cat.isPresent()) {
                return cat.get();
            }
        }
        if (request.categoryId() != null) {
            var cat = categoryRepository.findById(request.categoryId());
            if (cat.isPresent()) {
                return cat.get();
            }
        }
        String ref = request.categorySlug() != null ? request.categorySlug() : String.valueOf(request.categoryId());
        throw new CategoryNotFoundException(ref != null && !ref.isBlank() ? ref : "unknown");
    }

    @Transactional
    public void deactivate(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
        product.deactivate();
        productRepository.save(product);
    }

    // In-service Entity-to-DTO mappings
    private ProductResponse toProductResponse(Product product) {
        if (product == null) {
            return null;
        }

        List<ProductVariant> variants = product.getVariants() != null ? product.getVariants() : Collections.emptyList();

        List<String> availableSizes = variants.stream()
                .map(ProductVariant::getSize)
                .distinct()
                .sorted()
                .toList();

        List<String> availableColors = variants.stream()
                .map(ProductVariant::getColor)
                .distinct()
                .sorted()
                .toList();

        int totalStock = variants.stream()
                .mapToInt(ProductVariant::getStockQuantity)
                .sum();

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getBrand(),
                product.getGender(),
                toCategoryResponse(product.getCategory()),
                product.getImageUrl(),
                product.isActive(),
                availableSizes,
                availableColors,
                totalStock,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private ProductDetailResponse toProductDetailResponse(Product product) {
        if (product == null) {
            return null;
        }

        List<ProductVariant> variants = product.getVariants() != null ? product.getVariants() : Collections.emptyList();

        List<String> availableSizes = variants.stream()
                .map(ProductVariant::getSize)
                .distinct()
                .sorted()
                .toList();

        List<String> availableColors = variants.stream()
                .map(ProductVariant::getColor)
                .distinct()
                .sorted()
                .toList();

        int totalStock = variants.stream()
                .mapToInt(ProductVariant::getStockQuantity)
                .sum();

        List<VariantResponse> variantResponses = variants.stream()
                .map(variantService::toVariantResponse)
                .toList();

        return new ProductDetailResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getBrand(),
                product.getGender(),
                toCategoryResponse(product.getCategory()),
                product.getImageUrl(),
                product.isActive(),
                availableSizes,
                availableColors,
                totalStock,
                variantResponses,
                product.getCreatedAt(),
                product.getUpdatedAt()
        );
    }

    private CategoryResponse toCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl()
        );
    }
}
