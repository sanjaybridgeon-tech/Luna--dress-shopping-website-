/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ChevronRight, 
  Plus, 
  Minus,
  Heart,
  Share2,
  AlertCircle
} from 'lucide-react';
import { productService } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Variant Selection State
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setErrorMessage('');
      try {
        const res = await productService.getProductById(id);
        const data = res.data;
        setProduct(data);

        // Pre-select first available size and color
        if (data.variants && data.variants.length > 0) {
          const firstInStock = data.variants.find((v) => v.stockQuantity > 0) || data.variants[0];
          setSelectedSize(firstInStock.size);
          setSelectedColor(firstInStock.color);
        } else if (data.availableSizes && data.availableSizes.length > 0) {
          setSelectedSize(data.availableSizes[0]);
          if (data.availableColors && data.availableColors.length > 0) {
            setSelectedColor(data.availableColors[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load product details', err);
        setErrorMessage('Unable to load dress details. Please verify the URL or try again later.');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProduct();
  }, [id]);

  // Find exact variant matching selected size and color
  const matchedVariant = product?.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product?.variants?.[0] || null;

  const currentStock = matchedVariant?.stockQuantity ?? product?.totalStock ?? 0;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (!matchedVariant) return;

    addToCart(matchedVariant, product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-gray-100 rounded-3xl" />
          <div className="space-y-6 pt-6">
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-10 w-3/4 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded" />
            <div className="h-24 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (errorMessage || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-sans space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h2 className="text-2xl font-editorial font-bold text-luna-charcoal">
          Creation Not Found
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          {errorMessage || 'The requested dress could not be located in our atelier catalog.'}
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors"
        >
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-luna-gold-700">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-luna-gold-700">Creations</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-luna-gold-700">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-luna-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image Showcase */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 border border-luna-sand shadow-luxury">
            <img
              src={product.imageUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1200'}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            
            {/* Top Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.category && (
                <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-white/90 backdrop-blur-md text-luna-charcoal shadow-sm">
                  {product.category.name}
                </span>
              )}
              {product.gender === 'UNISEX' && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold bg-luna-slate-900 text-luna-gold-300 shadow-sm">
                  Unisex Silhouette
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Buying Controls */}
        <div className="lg:col-span-5 space-y-8 lg:pl-4">
          
          {/* Header & Pricing */}
          <div className="space-y-2 border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.25em] text-luna-gold-700 font-semibold">
                {product.brand || 'LUNA ATELIER'}
              </span>
              <div className="flex items-center gap-3 text-gray-400">
                <button className="hover:text-rose-500 transition-colors p-1" title="Add to Wishlist">
                  <Heart className="w-5 h-5 stroke-[1.5]" />
                </button>
                <button className="hover:text-black transition-colors p-1" title="Share Creation">
                  <Share2 className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center justify-between pt-2">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-luna-charcoal">
                ${Number(product.price).toFixed(2)}
              </span>

              {/* Real-time Stock Indicator */}
              <div>
                {isOutOfStock ? (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    Sold Out in Selected Variant
                  </span>
                ) : currentStock <= 5 ? (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Only {currentStock} left in atelier!
                  </span>
                ) : (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    In Stock ({currentStock} available)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
            {product.description}
          </p>

          {/* 1. Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-700 uppercase tracking-widest">
                Select Size
              </span>
              <span className="text-luna-gold-700 underline cursor-pointer text-[11px]">
                Atelier Sizing Guide
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.availableSizes?.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all ${
                    selectedSize === size
                      ? 'border-luna-slate-900 bg-luna-slate-900 text-white shadow-sm'
                      : 'border-gray-200 text-luna-charcoal hover:border-luna-gold-400 bg-white'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Color Selector */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-3">
              <span className="font-semibold text-gray-700 uppercase tracking-widest text-xs block">
                Colorway: <span className="font-normal text-gray-500">{selectedColor}</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3.5 py-1.5 text-xs rounded-full border transition-all ${
                      selectedColor === color
                        ? 'border-luna-gold-500 bg-luna-gold-50 text-luna-gold-900 font-semibold'
                        : 'border-gray-200 text-gray-600 hover:border-luna-sand'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Quantity Stepper & Add to Cart */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              
              {/* Stepper */}
              <div className="flex items-center border border-gray-200 rounded-full bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-gray-500 hover:text-black transition-colors disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-semibold text-luna-charcoal">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock || 10, quantity + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="p-2 text-gray-500 hover:text-black transition-colors disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2.5 shadow-md ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : isOutOfStock 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                      : 'bg-luna-slate-900 text-white hover:bg-luna-gold-600 hover:shadow-luxury-hover'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Shopping Bag</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Currently Sold Out</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-luna-gold-300" />
                    <span>Add to Shopping Bag • ${(product.price * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>

            </div>

            {/* SKU and Live Reference */}
            {matchedVariant && (
              <div className="text-[11px] text-gray-400 font-mono text-center">
                Atelier SKU: {matchedVariant.sku}
              </div>
            )}
          </div>

          {/* Reassurance Accordions / Badges */}
          <div className="border-t border-gray-100 pt-6 space-y-3.5 text-xs text-gray-600">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-luna-gold-600 flex-shrink-0" />
              <span>Complimentary insured courier delivery on orders over $150</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span>Complimentary returns within 30 days of atelier delivery</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Grade 6A Mulberry Silk &amp; Sustainable European Flax</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
