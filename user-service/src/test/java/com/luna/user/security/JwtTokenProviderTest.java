package com.luna.user.security;

import com.luna.user.entity.Role;
import com.luna.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;
    private final String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final long expirationMs = 3600000; // 1 hour

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider(secretKey, expirationMs);
    }

    @Test
    @DisplayName("Should generate valid JWT and successfully extract claims")
    void shouldGenerateAndValidateToken() {
        UUID userId = UUID.randomUUID();
        User user = User.create(
                "Jane Doe",
                "jane@example.com",
                "hashedpassword",
                Role.CUSTOMER,
                "+1234567890"
        );
        user.setId(userId);

        String token = jwtTokenProvider.generateToken(user);
        assertNotNull(token);
        assertFalse(token.isBlank());

        assertTrue(jwtTokenProvider.validateToken(token));
        assertEquals(userId, jwtTokenProvider.getUserIdFromToken(token));
        assertEquals("jane@example.com", jwtTokenProvider.getEmailFromToken(token));
        assertEquals("CUSTOMER", jwtTokenProvider.getRoleFromToken(token));
    }

    @Test
    @DisplayName("Should reject invalid token")
    void shouldRejectInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("invalid.token.string"));
    }
}
