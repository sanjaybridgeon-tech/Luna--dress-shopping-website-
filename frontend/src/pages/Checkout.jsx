/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  ShoppingBag, 
  ArrowRight, 
  MapPin, 
  Plus, 
  AlertCircle,
  Lock,
  Sparkles,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { authService, orderService } from '../services/api';

export default function Checkout() {
  const { cart, subtotal, shippingFee, totalAmount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    }
  }, [isAuthenticated, navigate]);

  // Form State
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [recipientPhone, setRecipientPhone] = useState('+1-555-0199');
  const [shippingAddressLine, setShippingAddressLine] = useState('');
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isCustomAddress, setIsCustomAddress] = useState(false);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Load saved delivery addresses from user-service via Gateway
  useEffect(() => {
    async function loadAddresses() {
      if (isAuthenticated) {
        try {
          const res = await authService.getAddresses();
          const list = res.data || [];
          setSavedAddresses(list);

          if (list.length > 0) {
            const defaultAddr = list.find((a) => a.isDefault) || list[0];
            setSelectedAddressId(defaultAddr.id);
            const formatted = `${defaultAddr.addressLine1}${defaultAddr.addressLine2 ? ', ' + defaultAddr.addressLine2 : ''}, ${defaultAddr.city}, ${defaultAddr.state} ${defaultAddr.postalCode}, ${defaultAddr.country}`;
            setShippingAddressLine(formatted);
          } else {
            setIsCustomAddress(true);
            setShippingAddressLine('742 Evergreen Terrace, Springfield, IL 62704, US');
          }
        } catch {
          setIsCustomAddress(true);
          setShippingAddressLine('742 Evergreen Terrace, Springfield, IL 62704, US');
        }
      }
    }
    loadAddresses();
  }, [isAuthenticated]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr.id);
    setIsCustomAddress(false);
    const formatted = `${addr.addressLine1}${addr.addressLine2 ? ', ' + addr.addressLine2 : ''}, ${addr.city}, ${addr.state} ${addr.postalCode}, ${addr.country}`;
    setShippingAddressLine(formatted);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (cart.length === 0) {
      setErrorMessage('Your shopping bag is empty.');
      return;
    }

    if (!shippingAddressLine.trim()) {
      setErrorMessage('Please provide a complete shipping address line.');
      return;
    }

    if (!recipientName.trim()) {
      setErrorMessage('Recipient full name is required.');
      return;
    }

    setSubmitting(true);

    try {
      // Build PlaceOrderRequest payload matching order-service DTO
      const payload = {
        items: cart.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddressLine: shippingAddressLine.trim(),
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim() || null,
      };

      // Call Order Service through API Gateway :8080
      const response = await orderService.placeOrder(payload);
      const createdOrder = response.data;

      // Clear local cart
      clearCart();

      // Navigate to order confirmation
      navigate('/order-confirmation', { state: { order: createdOrder } });
    } catch (err) {
      console.error('Order placement failed', err);
      const detail = err.response?.data?.detail 
        || err.response?.data?.message 
        || 'An error occurred while placing your order. Please verify stock availability.';
      setErrorMessage(detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-sans">
        <h2 className="text-2xl font-editorial font-bold text-luna-charcoal mb-4">
          No items in cart for checkout
        </h2>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors"
        >
          <span>Explore Catalog</span>
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
        <Link to="/cart" className="hover:text-luna-gold-700">Bag</Link>
        <span>/</span>
        <span className="text-luna-charcoal font-medium">Atelier Checkout</span>
      </nav>

      <div className="pb-6 border-b border-gray-200 mb-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-luna-gold-700 font-semibold mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>Encrypted Gateway Checkout</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal">
          Complete Your Order
        </h1>
      </div>

      {errorMessage && (
        <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to place order</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Form: Address & Payment */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Section 1: Recipient Contact */}
          <div className="bg-white rounded-2xl border border-luna-sand p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-luna-slate-900 text-white flex items-center justify-center text-xs font-bold font-editorial">
                1
              </span>
              <h2 className="text-lg font-editorial font-bold text-luna-charcoal">
                Recipient Contact
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Elena Rostova"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1.5">
                  Phone Number (for courier updates) *
                </label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+1-555-0199"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Delivery Address */}
          <div className="bg-white rounded-2xl border border-luna-sand p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-luna-slate-900 text-white flex items-center justify-center text-xs font-bold font-editorial">
                  2
                </span>
                <h2 className="text-lg font-editorial font-bold text-luna-charcoal">
                  Delivery Address
                </h2>
              </div>

              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCustomAddress(!isCustomAddress)}
                  className="text-xs text-luna-gold-700 hover:text-luna-gold-900 font-medium"
                >
                  {isCustomAddress ? 'Choose Saved Address' : '+ Enter New Address'}
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {!isCustomAddress && savedAddresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-luna-gold-500 bg-luna-gold-50/50 shadow-sm' 
                          : 'border-gray-200 hover:border-luna-sand bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-luna-charcoal flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-luna-gold-600" />
                          <span>Delivery Location</span>
                        </span>
                        {isSelected && <Check className="w-4 h-4 text-luna-gold-600" />}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed mt-1">
                        {addr.addressLine1} {addr.addressLine2}
                        <br />
                        {addr.city}, {addr.state} {addr.postalCode}
                        <br />
                        {addr.country}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Custom Address Line Input */
              <div className="text-xs space-y-2">
                <label className="block text-gray-600 font-medium">
                  Full Shipping Address Line *
                </label>
                <textarea
                  rows={3}
                  required
                  value={shippingAddressLine}
                  onChange={(e) => setShippingAddressLine(e.target.value)}
                  placeholder="742 Evergreen Terrace, Apt 4B, Springfield, IL 62704, US"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans leading-relaxed"
                />
                <p className="text-[11px] text-gray-400">
                  Include street, apartment/suite, city, state, postal code, and country.
                </p>
              </div>
            )}
          </div>

          {/* Section 3: Payment Method */}
          <div className="bg-white rounded-2xl border border-luna-sand p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-luna-slate-900 text-white flex items-center justify-center text-xs font-bold font-editorial">
                3
              </span>
              <h2 className="text-lg font-editorial font-bold text-luna-charcoal">
                Payment Method
              </h2>
            </div>

            {/* Selector */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-3.5 rounded-xl border flex items-center justify-between font-medium ${
                  paymentMethod === 'CARD'
                    ? 'border-luna-gold-500 bg-luna-gold-50/40 text-luna-charcoal font-semibold'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-luna-gold-600" /> Credit Card
                </span>
                {paymentMethod === 'CARD' && <Check className="w-4 h-4 text-luna-gold-600" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ATELIER_PAY')}
                className={`p-3.5 rounded-xl border flex items-center justify-between font-medium ${
                  paymentMethod === 'ATELIER_PAY'
                    ? 'border-luna-gold-500 bg-luna-gold-50/40 text-luna-charcoal font-semibold'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-luna-gold-600" /> Atelier Concierge Pay
                </span>
                {paymentMethod === 'ATELIER_PAY' && <Check className="w-4 h-4 text-luna-gold-600" />}
              </button>
            </div>

            {/* Simulated Card Fields */}
            {paymentMethod === 'CARD' && (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block text-gray-500 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-500 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Security CVC</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Order Review & Submit */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-luna-sand p-6 shadow-sm space-y-6 sticky top-28">
            
            <h2 className="text-xl font-editorial font-bold text-luna-charcoal pb-4 border-b border-gray-100 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs uppercase tracking-wider font-semibold font-sans text-gray-400">
                {cart.length} {cart.length === 1 ? 'Design' : 'Designs'}
              </span>
            </h2>

            {/* Item List Thumbnails */}
            <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.variantId} className="py-3 flex items-center gap-3">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=200'}
                    alt={item.productName}
                    className="w-12 h-16 object-cover rounded-md border border-gray-100 bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-editorial font-bold text-luna-charcoal truncate">
                      {item.productName}
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Size: {item.size} • {item.color}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-xs font-editorial font-bold text-luna-charcoal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financial Breakdown */}
            <div className="space-y-2.5 text-xs text-gray-600 font-sans border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-luna-charcoal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Courier Delivery</span>
                <span className="font-semibold text-luna-charcoal">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Free</span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base pt-3 border-t border-gray-200 text-luna-charcoal font-editorial font-bold">
                <span className="text-lg">Total Due</span>
                <span className="text-2xl font-bold text-luna-charcoal">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-luna-gold-600 transition-all shadow-md hover:shadow-luxury-hover flex items-center justify-center gap-2 group font-sans disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span>Transmitting Order to Atelier...</span>
              ) : (
                <>
                  <span>Place Order • ${totalAmount.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-luna-gold-300 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-center gap-3 text-[11px] text-gray-500 font-sans">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authenticated via Gateway
              </span>
              <span>•</span>
              <span>Atomic Stock Decrement</span>
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
