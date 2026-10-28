/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.service;

import com.luna.order.client.ProductServiceClient;
import com.luna.order.client.dto.StockAdjustmentRequest;
import com.luna.order.client.dto.VariantDetailResponse;
import com.luna.order.dto.*;
import com.luna.order.entity.Order;
import com.luna.order.entity.OrderItem;
import com.luna.order.entity.OrderStatus;
import com.luna.order.exception.InsufficientStockException;
import com.luna.order.exception.InvalidOrderStateException;
import com.luna.order.exception.OrderNotFoundException;
import com.luna.order.exception.VariantNotFoundException;
import com.luna.order.repository.OrderRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final BigDecimal FREE_SHIPPING_THRESHOLD = new BigDecimal("150.00");
    private static final BigDecimal STANDARD_SHIPPING_FEE = new BigDecimal("15.00");

    private final OrderRepository orderRepository;
    private final ProductServiceClient productServiceClient;

    public OrderService(OrderRepository orderRepository, ProductServiceClient productServiceClient) {
        this.orderRepository = orderRepository;
        this.productServiceClient = productServiceClient;
    }

    @Transactional
    public OrderResponse placeOrder(UUID userId, PlaceOrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one dress item");
        }

        List<VariantDetailResponse> fetchedVariants = new ArrayList<>();

        // 1. Validate stock availability with Product Service via OpenFeign
        for (OrderItemRequest itemReq : request.items()) {
            VariantDetailResponse variant = productServiceClient.getVariant(itemReq.variantId());
            if (variant == null) {
                throw new VariantNotFoundException(itemReq.variantId());
            }
            if (variant.stockQuantity() < itemReq.quantity()) {
                throw new InsufficientStockException(itemReq.variantId(), itemReq.quantity());
            }
            fetchedVariants.add(variant);
        }

        // 2. Atomically decrement inventory in Product Service
        List<OrderItemRequest> decrementedItems = new ArrayList<>();
        try {
            for (OrderItemRequest itemReq : request.items()) {
                productServiceClient.adjustStock(
                        itemReq.variantId(),
                        StockAdjustmentRequest.decrement(itemReq.quantity())
                );
                decrementedItems.add(itemReq);
            }
        } catch (Exception ex) {
            // Rollback any successfully decremented items if a subsequent decrement fails
            for (OrderItemRequest rollbackItem : decrementedItems) {
                try {
                    productServiceClient.adjustStock(
                            rollbackItem.variantId(),
                            StockAdjustmentRequest.increment(rollbackItem.quantity())
                    );
                } catch (Exception ignored) {
                    // Log error in production
                }
            }
            throw ex;
        }

        // 3. Calculate financial totals with immutable price snapshots
        BigDecimal subtotal = BigDecimal.ZERO;
        for (int i = 0; i < request.items().size(); i++) {
            OrderItemRequest itemReq = request.items().get(i);
            VariantDetailResponse variant = fetchedVariants.get(i);
            BigDecimal lineTotal = variant.price().multiply(BigDecimal.valueOf(itemReq.quantity()));
            subtotal = subtotal.add(lineTotal);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIPPING_THRESHOLD) >= 0 
                ? BigDecimal.ZERO 
                : STANDARD_SHIPPING_FEE;

        // 4. Create Order and nested OrderItem snapshots
        Order order = Order.create(
                userId,
                subtotal,
                shippingFee,
                request.shippingAddressLine().trim(),
                request.recipientName().trim(),
                request.recipientPhone() != null ? request.recipientPhone().trim() : null
        );

        for (int i = 0; i < request.items().size(); i++) {
            OrderItemRequest itemReq = request.items().get(i);
            VariantDetailResponse variant = fetchedVariants.get(i);

            OrderItem orderItem = OrderItem.create(
                    order,
                    variant.productId(),
                    variant.id(),
                    variant.productName(),
                    variant.size(),
                    variant.color(),
                    variant.price(),
                    itemReq.quantity()
            );
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);
        return toOrderResponse(savedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> listMyOrders(UUID userId, Pageable pageable) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toOrderResponse);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (!order.getUserId().equals(userId)) {
            throw new OrderNotFoundException(orderId);
        }

        return toOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(UUID orderId, UUID userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (!order.getUserId().equals(userId)) {
            throw new OrderNotFoundException(orderId);
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStateException(
                    "Only orders in PENDING status can be cancelled. Current status is: " + order.getStatus()
            );
        }

        // Replenish inventory back to Product Service
        for (OrderItem item : order.getItems()) {
            try {
                productServiceClient.adjustStock(
                        item.getVariantId(),
                        StockAdjustmentRequest.increment(item.getQuantity())
                );
            } catch (Exception ex) {
                // Log replenishment error in production
            }
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order updatedOrder = orderRepository.save(order);
        return toOrderResponse(updatedOrder);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> adminListOrders(OrderStatus status, Pageable pageable) {
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable)
                    .map(this::toOrderResponse);
        }
        return orderRepository.findAll(pageable)
                .map(this::toOrderResponse);
    }

    @Transactional
    public OrderResponse adminUpdateStatus(UUID orderId, UpdateStatusRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrderNotFoundException(orderId));

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new InvalidOrderStateException("Cannot modify an order in terminal state: " + order.getStatus());
        }

        // If admin cancels the order, replenish stock
        if (request.status() == OrderStatus.CANCELLED && order.getStatus() != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                try {
                    productServiceClient.adjustStock(
                            item.getVariantId(),
                            StockAdjustmentRequest.increment(item.getQuantity())
                    );
                } catch (Exception ex) {
                    // Log replenishment failure in production
                }
            }
        }

        order.setStatus(request.status());
        Order updated = orderRepository.save(order);
        return toOrderResponse(updated);
    }

    // In-service Entity-to-DTO mappings
    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::toOrderItemResponse)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUserId(),
                order.getStatus(),
                order.getSubtotal(),
                order.getShippingFee(),
                order.getTotalAmount(),
                order.getShippingAddressLine(),
                order.getRecipientName(),
                order.getRecipientPhone(),
                itemResponses,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    private OrderItemResponse toOrderItemResponse(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProductId(),
                item.getVariantId(),
                item.getProductName(),
                item.getSize(),
                item.getColor(),
                item.getUnitPrice(),
                item.getQuantity(),
                item.getLineTotal()
        );
    }
}
