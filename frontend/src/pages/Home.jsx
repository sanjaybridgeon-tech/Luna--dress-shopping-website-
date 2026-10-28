/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Star, 
  ChevronRight,
  Gem
} from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  useEffect(() => {
    async function loadHomeData() {
      try {
        setLoading(true);
        // Load categories and products in parallel
        const [catRes, prodRes] = await Promise.all([
          productService.getCategories().catch(() => ({ data: [] })),
          productService.getProducts({ size: 8 }).catch(() => ({ data: { content: [] } }))
        ]);

        setCategories(catRes.data || []);
        const productsList = prodRes.data?.content || prodRes.data || [];
        setFeaturedProducts(productsList);
      } catch (err) {
        console.error('Failed to load home page catalog data', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  // Filter products for the featured section
  const filteredProducts = activeCategoryFilter === 'ALL'
    ? featuredProducts
    : featuredProducts.filter((p) => p.category?.slug === activeCategoryFilter);

  return (
    <div className="w-full">
      
      {/* 1. Hero Banner Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-luna-slate-950 text-white">
        
        {/* Ambient Luxury Background with Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1800&auto=format&fit=crop&q=80"
            alt="Luna Haute Couture Silk Gown"
            className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-luna-slate-950 via-luna-slate-950/60 to-luna-slate-950/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,15,29,0.85)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-luna-gold-400/10 border border-luna-gold-400/30 text-luna-gold-300 text-xs uppercase tracking-[0.25em] font-sans font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-luna-gold-400" />
            <span>Autumn / Winter Atelier Collection</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-editorial font-bold text-white tracking-tight leading-[1.08]">
            Timeless Elegance, <br />
            <span className="italic font-normal gold-gradient-text">Sculpted By Light.</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 font-sans max-w-xl mx-auto leading-relaxed">
            Draped 100% mulberry silks, deep velvet evening gowns, and tailored modern silhouettes designed for unforgettable moments.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-luna-gold-400 text-luna-slate-950 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-luna-gold-300 transition-all shadow-luxury hover:shadow-luxury-hover group font-sans"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 text-luna-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/products?category=evening-dresses"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-[0.2em] border border-white/20 backdrop-blur-md transition-all font-sans"
            >
              <span>Eveningwear Salon</span>
            </Link>
          </div>

          {/* Trust Pillars */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-400 font-sans border-t border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <Truck className="w-4 h-4 text-luna-gold-400" />
              <span>Complimentary Shipping Over $150</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Gem className="w-4 h-4 text-luna-gold-400" />
              <span>100% Mulberry Silk &amp; Linen</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4 text-luna-gold-400" />
              <span>30-Day Atelier Returns</span>
            </div>
          </div>

        </div>
      </section>


      {/* 2. Curated Categories Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-luna-gold-700 font-sans block">
            The Atelier Collections
          </span>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal">
            Curated For Every Occasion
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
            From gala floor-sweeping gowns to effortless Mediterranean linens, discover our seasonal capsules.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 5).map((category, index) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className={`group relative overflow-hidden rounded-2xl border border-luna-sand bg-white shadow-sm hover:shadow-luxury transition-all duration-300 ${
                index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={category.imageUrl || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-luna-gold-700 uppercase tracking-widest font-semibold font-sans mb-1">
                    <span>Collection</span>
                    {category.productCount !== undefined && (
                      <span className="text-gray-400 font-normal">
                        {category.productCount} Creations
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-editorial font-bold text-luna-charcoal group-hover:text-luna-gold-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-sans line-clamp-2 mt-1.5 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-luna-charcoal font-sans group-hover:text-luna-gold-700">
                  <span>Explore Collection</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}

          {/* Unisex Capsule Card */}
          <Link
            to="/products?gender=UNISEX"
            className="group relative overflow-hidden rounded-2xl border border-luna-sand bg-luna-sand/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between p-8"
          >
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-luna-gold-700 font-sans block mb-2">
                Unisex Atelier
              </span>
              <h3 className="text-2xl font-editorial font-bold text-luna-charcoal mb-2">
                Fluid Heritage Tunics
              </h3>
              <p className="text-xs text-gray-600 font-sans leading-relaxed">
                Relaxed dropped shoulders, pure washed flax linens, and universal silhouettes designed for effortless luxury.
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs font-semibold text-luna-charcoal font-sans group-hover:text-luna-gold-700">
              <span>View Unisex Capsule</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>


      {/* 3. Featured Products Grid */}
      <section className="py-20 bg-white border-y border-luna-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-luna-gold-700 font-sans block">
                Seasonal Highlights
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal">
                Featured Creations
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategoryFilter('ALL')}
                className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all ${
                  activeCategoryFilter === 'ALL'
                    ? 'bg-luna-slate-900 text-white'
                    : 'bg-luna-sand text-gray-600 hover:text-black'
                }`}
              >
                All Highlights
              </button>
              {categories.slice(0, 3).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.slug)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium uppercase tracking-wider transition-all ${
                    activeCategoryFilter === cat.slug
                      ? 'bg-luna-slate-900 text-white'
                      : 'bg-luna-sand text-gray-600 hover:text-black'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white border border-gray-300 text-xs font-semibold text-luna-charcoal uppercase tracking-widest hover:border-luna-gold-500 hover:text-luna-gold-700 transition-all shadow-sm font-sans"
            >
              <span>View Full Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>


      {/* 4. Atelier Craftsmanship Spotlight */}
      <section className="py-24 bg-luna-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-luxury border border-luna-sand">
              <img
                src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1000&auto=format&fit=crop&q=80"
                alt="Luna Atelier Fabric Draping"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 p-6 rounded-xl bg-white/90 backdrop-blur-md border border-white/40 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-luna-gold-700 font-bold block mb-1">
                  Mulberry Silk Grade 6A
                </span>
                <p className="text-xs text-gray-700 font-sans italic">
                  "Every gown begins with the drape — falling along the bias to honor movement rather than constraint."
                </p>
              </div>
            </div>

            <div className="space-y-6 lg:pl-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luna-gold-100 text-luna-gold-800 text-xs tracking-widest uppercase font-semibold font-sans">
                <Sparkles className="w-3.5 h-3.5 text-luna-gold-600" />
                <span>The Luna Craft</span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-editorial font-bold text-luna-charcoal leading-tight">
                Designed For Fluidity, <br />
                <span className="italic font-normal">Crafted Without Compromise.</span>
              </h2>

              <p className="text-sm text-gray-600 font-sans leading-relaxed">
                At Luna Atelier, our master patternmakers construct garments intended to endure across seasons. From hand-sewn micro-sequins to double-faced wool blazer lapels, each stitch balances architectural precision with effortless sensuality.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4 border-t border-luna-sand">
                <div>
                  <h4 className="font-editorial text-2xl font-bold text-luna-charcoal">22-Momme</h4>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">Heavyweight mulberry silk weave</p>
                </div>
                <div>
                  <h4 className="font-editorial text-2xl font-bold text-luna-charcoal">Zero Waste</h4>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">Small-batch bespoke atelier runs</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/products?category=evening-dresses"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-luna-gold-800 hover:text-luna-gold-600 font-sans group"
                >
                  <span>Explore The Evening Wear Edit</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* 5. Editorial Press & Client Acclaim */}
      <section className="py-20 bg-luna-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="flex justify-center items-center gap-1 text-luna-gold-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-luna-gold-400" />
            ))}
          </div>

          <blockquote className="font-editorial text-2xl sm:text-3xl md:text-4xl italic text-gray-200 leading-snug max-w-3xl mx-auto">
            "The Aurelia Silk Slip redefines modern formalwear — completely unfussy yet utterly commanding in room presence."
          </blockquote>

          <div className="text-xs font-sans uppercase tracking-[0.2em] text-luna-gold-300">
            <span>Vogue Haute Couture Review • Milan Edition</span>
          </div>

        </div>
      </section>

    </div>
  );
}
