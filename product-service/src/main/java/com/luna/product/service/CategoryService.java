/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.service;

import com.luna.product.dto.CategoryResponse;
import com.luna.product.entity.Category;
import com.luna.product.exception.CategoryNotFoundException;
import com.luna.product.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> list() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toCategoryResponse)
                .toList();
    }

    public CategoryResponse getBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .map(this::toCategoryResponse)
                .orElseThrow(() -> new CategoryNotFoundException(slug));
    }

    public Category getEntityBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new CategoryNotFoundException(slug));
    }

    // In-service mapping
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
