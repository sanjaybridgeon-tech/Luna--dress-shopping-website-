/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.user.service;

import com.luna.user.dto.AddressRequest;
import com.luna.user.dto.AddressResponse;
import com.luna.user.dto.UpdateProfileRequest;
import com.luna.user.dto.UserResponse;
import com.luna.user.entity.Address;
import com.luna.user.entity.User;
import com.luna.user.exception.AddressNotFoundException;
import com.luna.user.exception.UserNotFoundException;
import com.luna.user.repository.AddressRepository;
import com.luna.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    public UserService(UserRepository userRepository, AddressRepository addressRepository) {
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        return mapToUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        user.setName(request.name().trim());
        if (request.phone() != null) {
            user.setPhone(request.phone().trim());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    @Transactional(readOnly = true)
    public List<AddressResponse> listAddresses(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }

        return addressRepository.findByUserId(userId).stream()
                .map(this::mapToAddressResponse)
                .toList();
    }

    @Transactional
    public AddressResponse addAddress(UUID userId, AddressRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));

        boolean isDefault = Boolean.TRUE.equals(request.isDefault());

        // If this is marked as default, clear previous default address
        if (isDefault) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(addr -> {
                addr.setDefault(false);
                addressRepository.save(addr);
            });
        } else {
            // If user has no existing addresses, make this first one default automatically
            List<Address> existing = addressRepository.findByUserId(userId);
            if (existing.isEmpty()) {
                isDefault = true;
            }
        }

        Address address = Address.create(
                user,
                request.line1().trim(),
                request.line2() != null ? request.line2().trim() : null,
                request.city().trim(),
                request.state().trim(),
                request.postalCode().trim(),
                request.country() != null ? request.country().trim() : "US",
                isDefault
        );

        Address savedAddress = addressRepository.save(address);
        return mapToAddressResponse(savedAddress);
    }

    @Transactional
    public void deleteAddress(UUID userId, UUID addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new AddressNotFoundException(addressId));

        addressRepository.delete(address);
    }

    // In-service Entity to DTO mapping
    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getPhone(),
                user.isActive(),
                user.getCreatedAt()
        );
    }

    private AddressResponse mapToAddressResponse(Address address) {
        return new AddressResponse(
                address.getId(),
                address.getLine1(),
                address.getLine2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry(),
                address.isDefault(),
                address.getCreatedAt()
        );
    }
}
