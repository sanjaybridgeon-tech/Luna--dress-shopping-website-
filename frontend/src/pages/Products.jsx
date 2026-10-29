/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  X, 
  Search, 
  SlidersHorizontal, 
  ArrowLeft, 
  ArrowRight,
  ShoppingBag,
  RotateCcw
} from 'lucide-react';
import { productService } from '../services/api';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract query filters from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedGender = searchParams.get('gender') || '';
  const selectedSize = searchParams.get('size') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const searchQuery = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const currentSort = searchParams.get('sort') || 'createdAt,desc';

  // Load Categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await productService.getCategories();
        setCategories(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to load categories', err);
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters or pagination change
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          size: 12,
          sort: currentSort,
        };

        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedGender) params.gender = selectedGender;
        if (selectedSize) params.size = selectedSize;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;

        const res = await productService.getProducts(params);
        const data = res.data;

        // Support both Spring Page object and array responses
        if (data && data.content) {
          setProducts(data.content);
          setTotalPages(data.totalPages || 1);
          setTotalElements(data.totalElements || data.content.length);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotalPages(1);
          setTotalElements(data.length);
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalElements(0);
        }
      } catch (err) {
        console.error('Failed to fetch catalog products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, selectedGender, selectedSize, minPrice, maxPrice, searchQuery, currentPage, currentSort]);

  // Helper to update specific param while keeping others
  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Reset to page 0 whenever filters change
    if (key !== 'page') {
      newParams.set('page', '0');
    }
    setSearchParams(newParams);
  };

  const handlePriceChange = (min, max) => {
    const newParams = new URLSearchParams(searchParams);
    if (min) newParams.set('minPrice', min); else newParams.delete('minPrice');
    if (max) newParams.set('maxPrice', max); else newParams.delete('maxPrice');
    newParams.set('page', '0');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedGender || selectedSize || minPrice || maxPrice || searchQuery
  );

  const activeFilterCount = [
    selectedCategory,
    selectedGender,
    selectedSize,
    minPrice || maxPrice,
    searchQuery,
  ].filter(Boolean).length;

  // Selected Category Title for Header
  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const pageTitle = activeCategoryObj 
    ? activeCategoryObj.name 
    : searchQuery 
      ? `Search results for "${searchQuery}"` 
      : 'Atelier Creations';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* 1. Breadcrumbs */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-luna-gold-700 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-luna-charcoal font-medium">Creations</span>
        {activeCategoryObj && (
          <>
            <span>/</span>
            <span className="text-luna-gold-700 font-semibold">{activeCategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* 2. Catalog Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-gray-200 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-lg">
            {activeCategoryObj?.description || 'Explore our hand-draped mulberry silks, midnight velvet gowns, and bespoke atelier tailoring.'}
          </p>
        </div>

        {/* Toolbar: Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-luna-charcoal hover:border-luna-gold-500 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-luna-gold-500 text-white text-[10px] flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-3 py-2 text-xs text-luna-charcoal font-medium focus:outline-none focus:border-luna-gold-400 cursor-pointer shadow-sm"
            >
              <option value="createdAt,desc">Newest Additions</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. Active Filters Pill Ribbon */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-4 border-b border-gray-100">
          <span className="text-xs text-gray-400 mr-1">Active:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luna-sand text-xs text-luna-charcoal font-medium">
              <span>Keyword: "{searchQuery}"</span>
              <button onClick={() => updateParam('search', '')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luna-gold-100 text-xs text-luna-gold-800 font-medium">
              <span>Category: {activeCategoryObj?.name || selectedCategory}</span>
              <button onClick={() => updateParam('category', '')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedGender && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luna-sand text-xs text-luna-charcoal font-medium">
              <span>Silhouette: {selectedGender}</span>
              <button onClick={() => updateParam('gender', '')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSize && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luna-sand text-xs text-luna-charcoal font-medium">
              <span>Size: {selectedSize}</span>
              <button onClick={() => updateParam('size', '')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-luna-sand text-xs text-luna-charcoal font-medium">
              <span>
                Price: {minPrice ? `$${minPrice}` : '$0'} - {maxPrice ? `$${maxPrice}` : 'Above'}
              </span>
              <button onClick={() => handlePriceChange('', '')} className="hover:text-rose-600">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-gray-500 hover:text-black underline ml-2 font-medium"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 4. Main Body: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 pt-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1">
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(slug) => updateParam('category', slug)}
            selectedGender={selectedGender}
            onSelectGender={(g) => updateParam('gender', g)}
            selectedSize={selectedSize}
            onSelectSize={(sz) => updateParam('size', sz)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          
          {/* Result Count */}
          <div className="text-xs text-gray-500 mb-6 flex justify-between items-center">
            <span>
              Showing <strong className="text-luna-charcoal">{products.length}</strong> of{' '}
              <strong className="text-luna-charcoal">{totalElements}</strong> creations
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 px-4 bg-white rounded-2xl border border-luna-sand space-y-4">
              <div className="w-16 h-16 rounded-full bg-luna-sand/70 flex items-center justify-center mx-auto text-luna-gold-600">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-2xl font-editorial font-bold text-luna-charcoal">
                No Creations Found
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto font-sans leading-relaxed">
                We could not find any dresses matching your selected filters. Try broadening your criteria or search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            /* Product Cards */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-14 pt-8 border-t border-gray-100 flex items-center justify-between text-xs font-sans">
              <button
                disabled={currentPage === 0}
                onClick={() => updateParam('page', String(currentPage - 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-luna-charcoal hover:border-luna-gold-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="text-gray-500">
                Page <strong className="text-luna-charcoal">{currentPage + 1}</strong> of{' '}
                <strong className="text-luna-charcoal">{totalPages}</strong>
              </span>

              <button
                disabled={currentPage + 1 >= totalPages}
                onClick={() => updateParam('page', String(currentPage + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-300 text-luna-charcoal hover:border-luna-gold-500 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

      {/* 5. Mobile Filter Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                  <h3 className="font-editorial text-xl font-bold text-luna-charcoal">
                    Filter Catalog
                  </h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-full text-gray-400 hover:text-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <ProductFilters
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(slug) => updateParam('category', slug)}
                  selectedGender={selectedGender}
                  onSelectGender={(g) => updateParam('gender', g)}
                  selectedSize={selectedSize}
                  onSelectSize={(sz) => updateParam('size', sz)}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={handlePriceChange}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors shadow-md"
                >
                  Apply Filters ({totalElements} Results)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
