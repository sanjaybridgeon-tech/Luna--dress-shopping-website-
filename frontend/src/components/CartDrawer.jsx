/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
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

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    navigate('/products');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-luna-sand transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-luna-cream/60">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-luna-gold-600" />
              <h2 className="text-xl font-editorial font-bold text-luna-charcoal tracking-wide">
                Shopping Bag
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-luna-gold-100 text-luna-gold-700">
                {totalItems}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-luna-charcoal hover:bg-gray-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-luna-sand/60 px-6 py-3 border-b border-luna-sand">
            {amountToFreeShipping > 0 ? (
              <div>
                <p className="text-xs text-gray-700 font-sans mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-luna-gold-600" />
                  <span>
                    Add <strong className="text-luna-gold-700 font-semibold">${amountToFreeShipping.toFixed(2)}</strong> more for <strong>Complimentary Courier Shipping</strong>
                  </span>
                </p>
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-luna-gold-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>You unlocked <strong>Complimentary Luxury Shipping</strong>!</span>
              </p>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                <div className="w-16 h-16 rounded-full bg-luna-sand/70 flex items-center justify-center mb-4 text-luna-gold-600">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-editorial font-semibold text-luna-charcoal mb-1">
                  Your bag is empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Explore our curated evening gowns, silk slips, and bespoke tailored pieces.
                </p>
                <button
                  onClick={handleContinueShopping}
                  className="px-6 py-2.5 rounded-full bg-luna-slate-900 text-white text-xs font-medium uppercase tracking-widest hover:bg-luna-gold-600 transition-colors"
                >
                  Discover Creations
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.variantId} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=300'}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-lg bg-gray-50 flex-shrink-0 border border-gray-100"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-editorial font-semibold text-luna-charcoal line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-gray-400 hover:text-rose-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          Size {item.size}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    {/* Price & Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-gray-200 rounded-full bg-white">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 text-gray-500 hover:text-black transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-luna-charcoal">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1.5 text-gray-500 hover:text-black transition-colors"
                          disabled={item.stockQuantity && item.quantity >= item.stockQuantity}
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-luna-charcoal font-editorial tracking-wide">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 bg-luna-cream/70 p-6 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-luna-charcoal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-luna-charcoal">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200 text-luna-charcoal">
                  <span className="font-editorial font-bold text-base">Total</span>
                  <span className="font-editorial font-bold text-lg text-luna-charcoal">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-luna-slate-900 text-white font-sans text-xs uppercase tracking-widest font-semibold hover:bg-luna-gold-600 transition-all shadow-md hover:shadow-luxury-hover flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-luna-gold-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Secure Checkout
                </span>
                <span>•</span>
                <span>Complimentary Returns</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
