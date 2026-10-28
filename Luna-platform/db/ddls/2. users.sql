-- ============================================================================
-- L U N A — Haute Couture E-Commerce Platform
-- Database Schema & Data Definition
-- Copyright (c) 2026 Luna Atelier. All rights reserved.
-- ============================================================================

-- ============================================================================
-- Service: User Service
-- Database: luna_users
-- Description: DDL for customer accounts, authentication, roles, and delivery addresses
-- ============================================================================

-- Ensure pgcrypto extension is available for UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Users Table
-- ----------------------------------------------------------------------------
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    name varchar(100) not null,
    email varchar(150) not null,
    password_hash varchar(255) not null,
    role varchar(20) not null default 'CUSTOMER',
    phone varchar(30),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table users 
    add constraint unique_users_email unique (email);

alter table users 
    add constraint chk_users_name_nonempty check (length(trim(name)) > 0),
    add constraint chk_users_email_nonempty check (length(trim(email)) > 0),
    add constraint chk_users_role check (role in ('CUSTOMER', 'ADMIN'));

create index if not exists idx_users_email on users (email);
create index if not exists idx_users_role on users (role);


-- ----------------------------------------------------------------------------
-- 2. Addresses Table
-- ----------------------------------------------------------------------------
create table if not exists addresses (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    line1 varchar(255) not null,
    line2 varchar(255),
    city varchar(100) not null,
    state varchar(100) not null,
    postal_code varchar(20) not null,
    country varchar(100) not null default 'US',
    is_default boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table addresses 
    add constraint fk_addresses_user 
    foreign key (user_id) references users (id) on delete cascade;

alter table addresses 
    add constraint chk_addresses_line1_nonempty check (length(trim(line1)) > 0),
    add constraint chk_addresses_city_nonempty check (length(trim(city)) > 0),
    add constraint chk_addresses_postal_code_nonempty check (length(trim(postal_code)) > 0);

create index if not exists idx_addresses_user_id on addresses (user_id);
create index if not exists idx_addresses_user_default on addresses (user_id, is_default);
