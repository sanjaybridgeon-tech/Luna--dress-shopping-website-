/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Quick add default variant if available
  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.variants && product.variants.length > 0) {
      // Pick first in-stock variant
      const availableVariant = product.variants.find((v) => v.stockQuantity > 0) || product.variants[0];
      addToCart(availableVariant, product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const defaultImage = 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800';

  return (
    <div className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-luna-sand hover:border-luna-gold-300 transition-all duration-300 shadow-sm hover:shadow-luxury">
      
      {/* Product Image Container */}
      <Link to={`/products/${product.id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-50 block">
        <img
          src={product.imageUrl || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Category Badge & Gender Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.category && (
            <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-white/90 backdrop-blur-md text-luna-charcoal shadow-sm">
              {product.category.name}
            </span>
          )}
          {product.gender === 'UNISEX' && (
            <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-luna-slate-900 text-luna-gold-300 shadow-sm">
              Unisex
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
          <span className="text-white text-xs font-sans font-medium flex items-center gap-1">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 text-luna-gold-300 group-hover:translate-x-0.5 transition-transform" />
          </span>

          {product.variants && product.variants.length > 0 && (
            <button
              onClick={handleQuickAdd}
              disabled={added}
              className={`p-2.5 rounded-full text-xs font-semibold shadow-md transition-all ${
                added 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-luna-charcoal hover:bg-luna-gold-500 hover:text-white'
              }`}
              title="Quick Add First Variant to Bag"
              aria-label="Quick Add"
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          )}
        </div>
      </Link>

      {/* Product Meta */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Sizes Indicator */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1.5 font-sans">
            <span className="uppercase tracking-widest text-luna-gold-700 font-semibold text-[10px]">
              {product.brand || 'LUNA'}
            </span>
            {product.availableSizes && product.availableSizes.length > 0 && (
              <span className="tracking-tight text-gray-400">
                Sizes: {product.availableSizes.join(', ')}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link to={`/products/${product.id}`} className="block">
            <h3 className="font-editorial text-base sm:text-lg font-bold text-luna-charcoal group-hover:text-luna-gold-700 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {/* Available Colors Tags */}
          {product.availableColors && product.availableColors.length > 0 && (
            <p className="text-[11px] text-gray-500 mt-0.5 truncate">
              {product.availableColors.join(' • ')}
            </p>
          )}
        </div>

        {/* Price & Stock */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="font-editorial text-base sm:text-lg font-bold text-luna-charcoal tracking-wide">
            ${Number(product.price).toFixed(2)}
          </span>

          {product.totalStock > 0 ? (
            <span className="text-[10px] text-emerald-700 font-medium px-2 py-0.5 bg-emerald-50 rounded-full">
              In Stock
            </span>
          ) : (
            <span className="text-[10px] text-gray-400 font-medium">
              Made to Order
            </span>
          )}
        </div>
      </div>

    </div>
  );
}
