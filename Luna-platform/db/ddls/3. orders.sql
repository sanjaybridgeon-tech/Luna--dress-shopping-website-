-- ============================================================================
-- L U N A — Haute Couture E-Commerce Platform
-- Database Schema & Data Definition
-- Copyright (c) 2026 Luna Atelier. All rights reserved.
-- ============================================================================

-- ============================================================================
-- Service: Order Service
-- Database: luna_orders
-- Description: DDL for customer orders, snapshot order items, and fulfillment tracking
-- ============================================================================

-- Ensure pgcrypto extension is available for UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Orders Table
-- ----------------------------------------------------------------------------
create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null,
    status varchar(20) not null default 'PENDING',
    subtotal numeric(12, 2) not null,
    shipping_fee numeric(12, 2) not null default 0.00,
    total_amount numeric(12, 2) not null,
    shipping_address_line varchar(500) not null,
    recipient_name varchar(100) not null,
    recipient_phone varchar(30),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table orders 
    add constraint chk_orders_status check (status in ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    add constraint chk_orders_subtotal_nonnegative check (subtotal >= 0.00),
    add constraint chk_orders_shipping_fee_nonnegative check (shipping_fee >= 0.00),
    add constraint chk_orders_total_positive check (total_amount > 0.00),
    add constraint chk_orders_recipient_name_nonempty check (length(trim(recipient_name)) > 0),
    add constraint chk_orders_shipping_address_nonempty check (length(trim(shipping_address_line)) > 0);

create index if not exists idx_orders_user_id on orders (user_id);
create index if not exists idx_orders_status on orders (status);
create index if not exists idx_orders_created_at on orders (created_at desc);


-- ----------------------------------------------------------------------------
-- 2. Order Items Table (Immutable Snapshot of Purchased Dresses)
-- ----------------------------------------------------------------------------
create table if not exists order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null,
    product_id uuid not null,
    variant_id uuid not null,
    product_name varchar(150) not null,
    size varchar(20) not null,
    color varchar(50) not null,
    unit_price numeric(12, 2) not null,
    quantity integer not null,
    line_total numeric(12, 2) not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table order_items 
    add constraint fk_order_items_order 
    foreign key (order_id) references orders (id) on delete cascade;

alter table order_items 
    add constraint chk_order_items_quantity_positive check (quantity > 0),
    add constraint chk_order_items_unit_price_positive check (unit_price > 0.00),
    add constraint chk_order_items_line_total_positive check (line_total > 0.00),
    add constraint chk_order_items_product_name_nonempty check (length(trim(product_name)) > 0),
    add constraint chk_order_items_size_nonempty check (length(trim(size)) > 0),
    add constraint chk_order_items_color_nonempty check (length(trim(color)) > 0);

create index if not exists idx_order_items_order_id on order_items (order_id);
create index if not exists idx_order_items_product_id on order_items (product_id);
create index if not exists idx_order_items_variant_id on order_items (variant_id);
