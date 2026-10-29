/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React from 'react';
import { RotateCcw, Filter, Check } from 'lucide-react';

export default function ProductFilters({
  categories = [],
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  selectedSize,
  onSelectSize,
  minPrice,
  maxPrice,
  onPriceChange,
  onResetFilters,
  hasActiveFilters,
}) {
  const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
  const GENDERS = [
    { label: 'All Silhouettes', value: '' },
    { label: 'Women', value: 'WOMEN' },
    { label: 'Unisex', value: 'UNISEX' },
  ];

  const PRICE_RANGES = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under $100', min: '', max: '100' },
    { label: '$100 to $200', min: '100', max: '200' },
    { label: 'Over $200', min: '200', max: '' },
  ];

  return (
    <aside className="w-full space-y-8 font-sans">
      
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-luna-gold-600" />
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-luna-charcoal">
            Refine Catalog
          </h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] text-luna-gold-700 hover:text-luna-gold-900 font-medium flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-700">
          Collection Category
        </h4>
        <div className="space-y-1.5 text-xs">
          <button
            type="button"
            onClick={() => onSelectCategory('')}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
              !selectedCategory 
                ? 'bg-luna-slate-900 text-white font-semibold shadow-sm' 
                : 'text-gray-600 hover:bg-luna-sand/60'
            }`}
          >
            <span>All Categories</span>
          </button>

          {(Array.isArray(categories) ? categories : []).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                selectedCategory === cat.slug
                  ? 'bg-luna-slate-900 text-white font-semibold shadow-sm'
                  : 'text-gray-600 hover:bg-luna-sand/60'
              }`}
            >
              <span>{cat.name}</span>
              {cat.productCount !== undefined && (
                <span className={`text-[10px] ${selectedCategory === cat.slug ? 'text-luna-gold-300' : 'text-gray-400'}`}>
                  {cat.productCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Gender / Silhouette */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-700">
          Silhouette / Drape
        </h4>
        <div className="grid grid-cols-1 gap-1.5 text-xs">
          {GENDERS.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => onSelectGender(g.value)}
              className={`px-3 py-2 rounded-lg text-left transition-all flex items-center justify-between ${
                selectedGender === g.value
                  ? 'bg-luna-slate-900 text-white font-semibold'
                  : 'text-gray-600 hover:bg-luna-sand/60'
              }`}
            >
              <span>{g.label}</span>
              {selectedGender === g.value && <Check className="w-3.5 h-3.5 text-luna-gold-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sizes */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-700">
          Atelier Size
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onSelectSize('')}
            className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
              !selectedSize
                ? 'bg-luna-slate-900 border-luna-slate-900 text-white font-semibold'
                : 'border-gray-200 text-gray-700 hover:border-luna-gold-400'
            }`}
          >
            All
          </button>
          {SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => onSelectSize(selectedSize === sz ? '' : sz)}
              className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                selectedSize === sz
                  ? 'bg-luna-slate-900 border-luna-slate-900 text-white font-semibold'
                  : 'border-gray-200 text-gray-700 hover:border-luna-gold-400'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Price Presets */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-700">
          Investment Price
        </h4>
        <div className="space-y-1.5 text-xs">
          {PRICE_RANGES.map((range) => {
            const isSelected = minPrice === range.min && maxPrice === range.max;
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => onPriceChange(range.min, range.max)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-luna-slate-900 text-white font-semibold'
                    : 'text-gray-600 hover:bg-luna-sand/60'
                }`}
              >
                <span>{range.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-luna-gold-400" />}
              </button>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
