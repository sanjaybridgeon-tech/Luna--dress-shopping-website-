/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 150.00;
const STANDARD_SHIPPING_FEE = 15.00;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('luna_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('luna_cart', JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to persist cart to localStorage', err);
    }
  }, [cart]);

  const addToCart = (variant, product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.variantId === variant.id);

      if (existingIndex > -1) {
        const updated = [...prevCart];
        const existingItem = updated[existingIndex];
        const maxStock = variant.stockQuantity || 99;
        const newQty = Math.min(existingItem.quantity + quantity, maxStock);
        updated[existingIndex] = { ...existingItem, quantity: newQty };
        return updated;
      }

      const newItem = {
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        price: Number(product.price),
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        imageUrl: product.imageUrl,
        stockQuantity: variant.stockQuantity,
        quantity: Math.min(quantity, variant.stockQuantity || 1),
      };

      return [...prevCart, newItem];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (variantId) => {
    setCart((prevCart) => prevCart.filter((item) => item.variantId !== variantId));
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.variantId === variantId) {
          const maxStock = item.stockQuantity || 99;
          return { ...item, quantity: Math.min(newQuantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Financial Computations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cart.reduce((sum, item) => {
    return sum + Number(item.price) * item.quantity;
  }, 0);

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 
    ? 0 
    : STANDARD_SHIPPING_FEE;

  const totalAmount = subtotal + shippingFee;

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountToFreeShipping,
        progressToFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
