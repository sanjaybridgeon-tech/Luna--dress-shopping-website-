/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  Sparkles,
  Tag
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
    shippingFee,
    totalAmount,
    amountToFreeShipping,
    progressToFreeShipping,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'LUNA10') {
      const discount = subtotal * 0.1;
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      setPromoError('Invalid promotion code. Try "LUNA10" for 10% off.');
    }
  };

  const finalTotal = Math.max(0, totalAmount - promoDiscount);

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center font-sans">
        <div className="w-20 h-20 rounded-full bg-luna-sand/70 flex items-center justify-center mx-auto mb-6 text-luna-gold-600">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-8 leading-relaxed">
          Explore our evening gowns, mulberry silk slips, and tailored silhouettes crafted for timeless elegance.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-all shadow-luxury hover:shadow-luxury-hover"
        >
          <span>Explore The Collection</span>
          <ArrowRight className="w-4 h-4 text-luna-gold-300" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-luna-gold-700">Home</Link>
        <span>/</span>
        <span className="text-luna-charcoal font-medium">Shopping Bag</span>
      </nav>

      <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal">
          Your Shopping Bag
        </h1>
        <span className="text-xs uppercase tracking-widest font-semibold text-gray-500">
          {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Items List */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Free Shipping Notification Banner */}
          <div className="bg-luna-sand/60 rounded-xl p-4 border border-luna-sand">
            {amountToFreeShipping > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-700 font-sans">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-luna-gold-600" />
                    <span>
                      Add <strong className="text-luna-gold-700 font-semibold">${amountToFreeShipping.toFixed(2)}</strong> more for <strong>Complimentary Luxury Shipping</strong>
                    </span>
                  </span>
                  <span className="text-[11px] text-gray-500 font-semibold">
                    ${subtotal.toFixed(0)} / $150
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-luna-gold-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You have unlocked <strong>Complimentary Worldwide Courier Shipping</strong>!</span>
              </div>
            )}
          </div>

          {/* Items Table/Cards */}
          <div className="divide-y divide-gray-100 bg-white rounded-2xl border border-luna-sand p-6 shadow-sm">
            {cart.map((item) => (
              <div key={item.variantId} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                
                {/* Thumbnail */}
                <Link to={`/products/${item.productId}`} className="w-24 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300'}
                    alt={item.productName}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform"
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 space-y-1">
                  <Link to={`/products/${item.productId}`} className="hover:text-luna-gold-700 transition-colors">
                    <h3 className="font-editorial text-lg sm:text-xl font-bold text-luna-charcoal">
                      {item.productName}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="px-2.5 py-0.5 rounded bg-luna-sand text-gray-800 font-semibold text-[11px]">
                      Size: {item.size}
                    </span>
                    <span>•</span>
                    <span>{item.color}</span>
                    <span>•</span>
                    <span className="text-gray-400 font-mono text-[10px]">SKU: {item.sku}</span>
                  </div>

                  <p className="text-xs text-gray-400 pt-1">
                    Unit Price: ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="flex items-center border border-gray-200 rounded-full bg-white">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-luna-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="p-2 text-gray-500 hover:text-black transition-colors"
                      disabled={item.stockQuantity && item.quantity >= item.stockQuantity}
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="font-editorial text-lg sm:text-xl font-bold text-luna-charcoal min-w-[70px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-gray-400 hover:text-rose-600 transition-colors p-1.5"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              to="/products"
              className="text-xs uppercase tracking-widest font-semibold text-luna-gold-700 hover:text-luna-gold-900 transition-colors"
            >
              &larr; Continue Exploring Collections
            </Link>
          </div>

        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-luna-sand p-6 shadow-sm space-y-6">
            
            <h2 className="text-xl font-editorial font-bold text-luna-charcoal pb-4 border-b border-gray-100">
              Order Summary
            </h2>

            {/* Calculations */}
            <div className="space-y-3 text-xs text-gray-600 font-sans">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-luna-charcoal">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-luna-charcoal">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Complimentary</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              {promoApplied && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Promotion (10% Off)</span>
                  <span>-${promoDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-base pt-4 border-t border-gray-200 text-luna-charcoal font-editorial font-bold">
                <span className="text-lg">Estimated Total</span>
                <span className="text-xl">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Promotion Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Promotion code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-luna-sand/50 border border-gray-200 rounded-lg text-luna-charcoal placeholder-gray-400 focus:outline-none focus:border-luna-gold-400 font-sans uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-luna-gold-600 transition-colors"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[11px] text-rose-600 mt-1.5">{promoError}</p>
              )}
              {promoApplied && (
                <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Promotion code applied successfully!
                </p>
              )}
            </form>

            {/* Checkout Action */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 px-6 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-luna-gold-600 transition-all shadow-md hover:shadow-luxury-hover flex items-center justify-center gap-2 group font-sans"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4 text-luna-gold-300 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Reassurance Pillars */}
            <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs text-gray-500 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Encrypted 256-Bit SSL Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-luna-gold-600 flex-shrink-0" />
                <span>Insured Global Courier with tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span>30-Day Complimentary Atelier Returns</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
