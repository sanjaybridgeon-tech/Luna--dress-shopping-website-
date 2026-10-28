/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.user.controller;

import com.luna.user.dto.AddressRequest;
import com.luna.user.dto.AddressResponse;
import com.luna.user.dto.UpdateProfileRequest;
import com.luna.user.dto.UserResponse;
import com.luna.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final UserService userService;

    public AccountController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<UserResponse> getAccountProfile(Authentication authentication) {
        UUID userId = extractUserId(authentication);
        UserResponse response = userService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateAccountProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        UUID userId = extractUserId(authentication);
        UserResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/addresses")
    public ResponseEntity<List<AddressResponse>> listAddresses(Authentication authentication) {
        UUID userId = extractUserId(authentication);
        List<AddressResponse> addresses = userService.listAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/addresses")
    public ResponseEntity<AddressResponse> addAddress(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request
    ) {
        UUID userId = extractUserId(authentication);
        AddressResponse address = userService.addAddress(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(address);
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            Authentication authentication,
            @PathVariable UUID addressId
    ) {
        UUID userId = extractUserId(authentication);
        userService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }

    private UUID extractUserId(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new AccessDeniedException("User is not authenticated");
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof UUID uuid) {
            return uuid;
        }
        return UUID.fromString(principal.toString());
    }
}
