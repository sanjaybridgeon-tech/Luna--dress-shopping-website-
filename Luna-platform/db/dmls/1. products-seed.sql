-- ============================================================================
-- L U N A — Haute Couture E-Commerce Platform
-- Database Schema & Data Definition
-- Copyright (c) 2026 Luna Atelier. All rights reserved.
-- ============================================================================

-- ============================================================================
-- Service: Product Service
-- Database: luna_products
-- Description: DML seed script for categories, luxury dresses, and size/color variants
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Insert Categories
-- ----------------------------------------------------------------------------
insert into categories (id, name, slug, description, image_url, created_at, updated_at) values
    (1, 'Evening Dresses', 'evening-dresses', 'Elegant gowns and luxury floor-length dresses for gala and formal events.', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', now(), now()),
    (2, 'Cocktail & Party', 'cocktail-party', 'Chic partywear, metallic slips, and stunning cocktail dresses.', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', now(), now()),
    (3, 'Casual Summer Dresses', 'casual-summer-dresses', 'Breezy linens, sundresses, and effortless daywear for warm weather.', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', now(), now()),
    (4, 'Maxi & Midi Dresses', 'maxi-midi-dresses', 'Flowing silhouettes and versatile lengths for everyday elegance.', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', now(), now()),
    (5, 'Work & Formal', 'work-formal', 'Tailored blazer dresses, structured sheaths, and polished office attire.', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800', now(), now())
on conflict (id) do nothing;

-- Ensure category sequence stays in sync
select setval('categories_id_seq', (select max(id) from categories));


-- ----------------------------------------------------------------------------
-- 2. Insert Products
-- ----------------------------------------------------------------------------
insert into products (id, name, description, price, brand, gender, category_id, image_url, active, created_at, updated_at) values
    ('a0000001-0000-0000-0000-000000000001', 'Aurelia Silk Slip Evening Dress', 
     'Cut from luminous 100% mulberry silk, the Aurelia dress features a delicate cowl neckline and gentle bias drape.', 
     189.99, 'Luna', 'WOMEN', 1, 
     'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000002', 'Midnight Velvet Backless Gown', 
     'Sumptuous deep-pile velvet with a dramatic open back and floor-sweeping puddle train. Perfect for gala galas.', 
     249.50, 'Luna', 'WOMEN', 1, 
     'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000003', 'Celeste Sequined Cocktail Mini', 
     'All-over hand-applied micro-sequins with a stretch-mesh lining and sculpted square neckline.', 
     145.00, 'Luna', 'WOMEN', 2, 
     'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000004', 'Sienna Tiered Linen Sundress', 
     'Pure breathable European linen crafted with soft cascading tiers, smocked back bodice, and adjustable straps.', 
     89.00, 'Luna', 'WOMEN', 3, 
     'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000005', 'Floral Meadow Chiffon Midi Dress', 
     'Sheer pleated floral chiffon with romantic blouson sleeves, sash tie waist, and flutter hem.', 
     119.00, 'Luna', 'WOMEN', 4, 
     'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000006', 'Valencia Structured Blazer Dress', 
     'Sharp double-breasted tailoring featuring peak satin lapels, padded shoulders, and tortoiseshell buttons.', 
     165.00, 'Luna', 'WOMEN', 5, 
     'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000007', 'Monaco Pleated Halter Maxi Dress', 
     'Sunburst accordion pleating falling from an engraved gold halter neckline into a sweeping A-line skirt.', 
     210.00, 'Luna', 'WOMEN', 4, 
     'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', true, now(), now()),

    ('a0000001-0000-0000-0000-000000000008', 'Luna Heritage Unisex Linen Tunic Shirt', 
     'Relaxed drop-shoulder tunic woven from washed flax linen. Designed for versatile unisex drape.', 
     75.00, 'Luna', 'UNISEX', 3, 
     'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', true, now(), now())
on conflict (id) do nothing;


-- ----------------------------------------------------------------------------
-- 3. Insert Product Variants (Sizes, Colors, SKUs & Inventory Counts)
-- ----------------------------------------------------------------------------
insert into product_variants (id, product_id, size, color, sku, stock_quantity, created_at, updated_at) values
    -- Aurelia Silk Slip (Product 1)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000001', 'XS', 'Emerald Green', 'LUNA-AUR-GRN-XS', 12, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000001', 'S',  'Emerald Green', 'LUNA-AUR-GRN-S',  20, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000001', 'M',  'Emerald Green', 'LUNA-AUR-GRN-M',  15, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000001', 'S',  'Champagne Gold', 'LUNA-AUR-GLD-S', 18, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000001', 'M',  'Champagne Gold', 'LUNA-AUR-GLD-M', 25, now(), now()),

    -- Midnight Velvet (Product 2)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000002', 'S',  'Midnight Black', 'LUNA-VLV-BLK-S', 10, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000002', 'M',  'Midnight Black', 'LUNA-VLV-BLK-M', 14, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000002', 'L',  'Midnight Black', 'LUNA-VLV-BLK-L', 8,  now(), now()),

    -- Celeste Sequined (Product 3)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000003', 'XS', 'Rose Gold', 'LUNA-CEL-RSG-XS', 8,  now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000003', 'S',  'Rose Gold', 'LUNA-CEL-RSG-S',  15, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000003', 'M',  'Rose Gold', 'LUNA-CEL-RSG-M',  12, now(), now()),

    -- Sienna Tiered Linen (Product 4)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000004', 'S',  'Terracotta', 'LUNA-SIE-TER-S', 25, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000004', 'M',  'Terracotta', 'LUNA-SIE-TER-M', 30, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000004', 'L',  'Terracotta', 'LUNA-SIE-TER-L', 18, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000004', 'S',  'Sage Mist',  'LUNA-SIE-SGE-S', 20, now(), now()),

    -- Floral Meadow Chiffon (Product 5)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000005', 'S',  'Sky Floral', 'LUNA-FLR-BLU-S', 14, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000005', 'M',  'Sky Floral', 'LUNA-FLR-BLU-M', 22, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000005', 'L',  'Sky Floral', 'LUNA-FLR-BLU-L', 10, now(), now()),

    -- Valencia Blazer Dress (Product 6)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000006', 'XS', 'Ivory White', 'LUNA-VAL-IVR-XS', 10, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000006', 'S',  'Ivory White', 'LUNA-VAL-IVR-S',  16, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000006', 'M',  'Ivory White', 'LUNA-VAL-IVR-M',  18, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000006', 'S',  'Jet Black',   'LUNA-VAL-BLK-S',  20, now(), now()),

    -- Monaco Pleated (Product 7)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000007', 'S',  'Sapphire Blue', 'LUNA-MON-BLU-S', 12, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000007', 'M',  'Sapphire Blue', 'LUNA-MON-BLU-M', 15, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000007', 'L',  'Sapphire Blue', 'LUNA-MON-BLU-L', 9,  now(), now()),

    -- Luna Heritage Unisex Tunic (Product 8)
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000008', 'M',  'Oatmeal Sand', 'LUNA-TNC-SND-M', 35, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000008', 'L',  'Oatmeal Sand', 'LUNA-TNC-SND-L', 40, now(), now()),
    (gen_random_uuid(), 'a0000001-0000-0000-0000-000000000008', 'XL', 'Oatmeal Sand', 'LUNA-TNC-SND-XL', 25, now(), now())
on conflict (sku) do nothing;
