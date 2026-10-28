-- ============================================================================
-- L U N A — Haute Couture E-Commerce Platform
-- Database Schema & Data Definition
-- Copyright (c) 2026 Luna Atelier. All rights reserved.
-- ============================================================================

-- ============================================================================
-- Service: Product Service
-- Database: luna_products
-- Description: DDL for clothing catalog, categories, products, and size/color variants
-- ============================================================================

-- Ensure pgcrypto extension is available for UUID generation if needed
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Categories Table
-- ----------------------------------------------------------------------------
create table if not exists categories (
    id bigserial primary key,
    name varchar(80) not null,
    slug varchar(80) not null,
    description varchar(500),
    image_url varchar(1000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table categories 
    add constraint unique_categories_slug unique (slug);

alter table categories 
    add constraint chk_categories_name_nonempty check (length(trim(name)) > 0),
    add constraint chk_categories_slug_nonempty check (length(trim(slug)) > 0);

create index if not exists idx_categories_slug on categories (slug);


-- ----------------------------------------------------------------------------
-- 2. Products Table
-- ----------------------------------------------------------------------------
create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    name varchar(150) not null,
    description text,
    price numeric(12, 2) not null,
    brand varchar(80) not null default 'Luna',
    gender varchar(20) not null,
    category_id bigint not null,
    image_url varchar(1000),
    active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table products 
    add constraint fk_products_category 
    foreign key (category_id) references categories (id);

alter table products 
    add constraint chk_products_name_nonempty check (length(trim(name)) > 0),
    add constraint chk_products_price_positive check (price > 0.00),
    add constraint chk_products_gender check (gender in ('MEN', 'WOMEN', 'UNISEX'));

create index if not exists idx_products_category_id on products (category_id);
create index if not exists idx_products_gender on products (gender);
create index if not exists idx_products_active on products (active);
create index if not exists idx_products_price on products (price);
create index if not exists idx_products_created_at on products (created_at desc);
create index if not exists idx_products_name_lower on products (lower(name));


-- ----------------------------------------------------------------------------
-- 3. Product Variants Table (Size, Color, SKU & Stock Inventory)
-- ----------------------------------------------------------------------------
create table if not exists product_variants (
    id uuid primary key default gen_random_uuid(),
    product_id uuid not null,
    size varchar(20) not null,
    color varchar(40) not null,
    sku varchar(80) not null,
    stock_quantity integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table product_variants 
    add constraint fk_variants_product 
    foreign key (product_id) references products (id) on delete cascade;

alter table product_variants 
    add constraint unique_variants_sku unique (sku);

alter table product_variants 
    add constraint unique_variants_product_size_color unique (product_id, size, color);

alter table product_variants 
    add constraint chk_variants_stock_nonnegative check (stock_quantity >= 0),
    add constraint chk_variants_sku_nonempty check (length(trim(sku)) > 0),
    add constraint chk_variants_size_nonempty check (length(trim(size)) > 0),
    add constraint chk_variants_color_nonempty check (length(trim(color)) > 0);

create index if not exists idx_variants_product_id on product_variants (product_id);
create index if not exists idx_variants_sku on product_variants (sku);
create index if not exists idx_variants_size on product_variants (size);
create index if not exists idx_variants_color on product_variants (color);
create index if not exists idx_variants_stock on product_variants (stock_quantity);
