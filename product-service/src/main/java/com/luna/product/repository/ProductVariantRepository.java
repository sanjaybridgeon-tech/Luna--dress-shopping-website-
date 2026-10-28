/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.product.repository;

import com.luna.product.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, UUID> {

    List<ProductVariant> findByProductId(UUID productId);

    Optional<ProductVariant> findBySku(String sku);

    boolean existsBySku(String sku);

    /**
     * Atomically decrements the variant stock quantity if and only if sufficient inventory exists.
     * Prevents overselling during high concurrent flash sales.
     *
     * @param id variant UUID
     * @param qty quantity to decrement
     * @return number of affected rows (1 if successful, 0 if insufficient stock)
     */
    @Modifying
    @Query("UPDATE ProductVariant v SET v.stockQuantity = v.stockQuantity - :qty WHERE v.id = :id AND v.stockQuantity >= :qty")
    int decrementStock(@Param("id") UUID id, @Param("qty") int qty);

    /**
     * Atomically increments the variant stock quantity (e.g. on order cancellation/refund).
     *
     * @param id variant UUID
     * @param qty quantity to add
     * @return number of affected rows
     */
    @Modifying
    @Query("UPDATE ProductVariant v SET v.stockQuantity = v.stockQuantity + :qty WHERE v.id = :id")
    int addStock(@Param("id") UUID id, @Param("qty") int qty);
}
