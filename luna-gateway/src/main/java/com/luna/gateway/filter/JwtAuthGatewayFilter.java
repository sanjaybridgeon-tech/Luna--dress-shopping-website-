/*
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Microservices Platform
 * 
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * Confidential & Proprietary.
 * ============================================================================
 */

package com.luna.gateway.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthGatewayFilter implements GlobalFilter, Ordered {

    private final String secretKey;

    public JwtAuthGatewayFilter(
            @Value("${jwt.secret:404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970}") String secretKey
    ) {
        this.secretKey = secretKey;
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(secretKey);
        } catch (IllegalArgumentException e) {
            keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();
        HttpMethod method = request.getMethod();

        // 1. Allow Preflight CORS OPTIONS requests
        if (HttpMethod.OPTIONS.equals(method)) {
            return chain.filter(exchange);
        }

        // 2. Allow Actuator and Swagger / API Docs
        if (path.startsWith("/actuator") || path.startsWith("/v3/api-docs") || path.startsWith("/swagger-ui")) {
            return chain.filter(exchange);
        }

        // 3. Allow Public Auth Endpoints (register, login)
        if (path.startsWith("/api/auth/")) {
            return chain.filter(exchange);
        }

        // 4. Allow Public Read-Only Product Catalog Endpoints (GET products & categories)
        boolean isPublicProductRead = HttpMethod.GET.equals(method) && 
                (path.startsWith("/api/products") || path.startsWith("/api/categories"));

        String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            if (isPublicProductRead) {
                return chain.filter(exchange);
            }
            return writeErrorResponse(
                    exchange.getResponse(),
                    HttpStatus.UNAUTHORIZED,
                    "https://luna.com/errors/unauthorized",
                    "Unauthorized",
                    "Full authentication is required to access this resource"
            );
        }

        String token = authHeader.substring(7).trim();
        Claims claims;
        try {
            claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            if (isPublicProductRead) {
                return chain.filter(exchange);
            }
            return writeErrorResponse(
                    exchange.getResponse(),
                    HttpStatus.UNAUTHORIZED,
                    "https://luna.com/errors/unauthorized",
                    "Unauthorized",
                    "Invalid or expired JWT token"
            );
        }

        String userId = claims.getSubject();
        String email = claims.get("email", String.class);
        String role = claims.get("role", String.class);

        // 5. Role-Based Access Control for Administrative Actions
        boolean isProductWrite = (path.startsWith("/api/products") || path.startsWith("/api/categories")) &&
                (HttpMethod.POST.equals(method) || HttpMethod.PUT.equals(method) || HttpMethod.DELETE.equals(method));
        boolean isAdminOrderRoute = path.startsWith("/api/admin/orders");

        if ((isProductWrite || isAdminOrderRoute) && !"ADMIN".equalsIgnoreCase(role)) {
            return writeErrorResponse(
                    exchange.getResponse(),
                    HttpStatus.FORBIDDEN,
                    "https://luna.com/errors/forbidden",
                    "Forbidden",
                    "Access denied: Administrator privileges required"
            );
        }

        // 6. Forward verified downstream identity headers
        ServerHttpRequest mutatedRequest = request.mutate()
                .header("X-User-Id", userId != null ? userId : "")
                .header("X-User-Email", email != null ? email : "")
                .header("X-User-Role", role != null ? role : "")
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private Mono<Void> writeErrorResponse(
            ServerHttpResponse response,
            HttpStatus status,
            String type,
            String title,
            String detail
    ) {
        response.setStatusCode(status);
        response.getHeaders().setContentType(MediaType.APPLICATION_PROBLEM_JSON);

        String json = String.format("""
                {
                  "type": "%s",
                  "title": "%s",
                  "status": %d,
                  "detail": "%s"
                }
                """, type, title, status.value(), detail);

        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        DataBuffer buffer = response.bufferFactory().wrap(bytes);
        return response.writeWith(Mono.just(buffer));
    }

    @Override
    public int getOrder() {
        return -100; // Execute early in filter chain
    }
}
