-- ============================================================================
-- L U N A — Haute Couture E-Commerce Platform
-- Database Schema & Data Definition
-- Copyright (c) 2026 Luna Atelier. All rights reserved.
-- ============================================================================

-- ============================================================================
-- Service: User Service
-- Database: luna_users
-- Description: Seed data for default admin and customer accounts
-- Password for both accounts is: Password123!
-- ============================================================================

INSERT INTO users (id, name, email, password_hash, role, phone, active, created_at, updated_at)
VALUES 
    -- Atelier Administrator
    (
        '11111111-1111-1111-1111-111111111111',
        'Atelier Director',
        'admin@luna.com',
        '$2a$10$ddCCxHqa2ofsXL/ifGoWWuCWi3Bt90A1ep49AHt2NcClZL.I0BZ6m',
        'ADMIN',
        '+1-555-0100',
        true,
        now(),
        now()
    ),
    -- Demo Customer (Elena Rostova)
    (
        '74bd62d5-3879-4910-b9bb-d5881569f770',
        'Elena Rostova',
        'elena.rostova@example.com',
        '$2a$10$ddCCxHqa2ofsXL/ifGoWWuCWi3Bt90A1ep49AHt2NcClZL.I0BZ6m',
        'CUSTOMER',
        '+1-555-0199',
        true,
        now(),
        now()
    )
ON CONFLICT (email) DO NOTHING;

-- Seed default shipping address for Elena Rostova
INSERT INTO addresses (id, user_id, line1, line2, city, state, postal_code, country, is_default, created_at, updated_at)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    '74bd62d5-3879-4910-b9bb-d5881569f770',
    '740 Park Avenue',
    'Penthouse B',
    'New York',
    'NY',
    '10021',
    'US',
    true,
    now(),
    now()
)
ON CONFLICT (id) DO NOTHING;
