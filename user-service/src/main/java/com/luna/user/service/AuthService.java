/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.user.service;

import com.luna.user.dto.AuthResponse;
import com.luna.user.dto.LoginRequest;
import com.luna.user.dto.RegisterRequest;
import com.luna.user.dto.UserResponse;
import com.luna.user.entity.Role;
import com.luna.user.entity.User;
import com.luna.user.exception.EmailAlreadyExistsException;
import com.luna.user.exception.InvalidCredentialsException;
import com.luna.user.repository.UserRepository;
import com.luna.user.security.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyExistsException(normalizedEmail);
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        User user = User.create(
                request.name().trim(),
                normalizedEmail,
                encodedPassword,
                Role.CUSTOMER,
                request.phone() != null ? request.phone().trim() : null
        );

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser);

        return AuthResponse.of(token, jwtTokenProvider.getExpirationMs(), mapToUserResponse(savedUser));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new InvalidCredentialsException("User account is inactive. Please contact support.");
        }

        String token = jwtTokenProvider.generateToken(user);
        return AuthResponse.of(token, jwtTokenProvider.getExpirationMs(), mapToUserResponse(user));
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
}
