/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.order.controller;

import com.luna.order.dto.OrderResponse;
import com.luna.order.dto.PlaceOrderRequest;
import com.luna.order.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @Valid @RequestBody PlaceOrderRequest request
    ) {
        UUID userId = resolveUserId(userIdHeader);
        OrderResponse response = orderService.placeOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<OrderResponse>> listMyOrders(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        UUID userId = resolveUserId(userIdHeader);
        Page<OrderResponse> orders = orderService.listMyOrders(userId, pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @PathVariable UUID id
    ) {
        UUID userId = resolveUserId(userIdHeader);
        OrderResponse response = orderService.getOrderById(id, userId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader,
            @PathVariable UUID id
    ) {
        UUID userId = resolveUserId(userIdHeader);
        OrderResponse response = orderService.cancelOrder(id, userId);
        return ResponseEntity.ok(response);
    }

    private UUID resolveUserId(String userIdHeader) {
        if (userIdHeader == null || userIdHeader.isBlank()) {
            throw new IllegalArgumentException("User authentication required: X-User-Id header missing");
        }
        try {
            return UUID.fromString(userIdHeader.trim());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid X-User-Id header format");
        }
    }
}
