/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { 
  CheckCircle, 
  Package, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Copy, 
  Check, 
  Calendar 
} from 'lucide-react';

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order;
  const [copied, setCopied] = React.useState(false);

  // If accessed directly without an order in history, redirect to orders
  if (!order) {
    return <Navigate to="/orders" replace />;
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      
      {/* Success Card Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle className="w-9 h-9 stroke-[1.8]" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luna-gold-100 text-luna-gold-800 text-xs tracking-widest uppercase font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-luna-gold-600" />
          <span>Atelier Order Confirmed</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-editorial font-bold text-luna-charcoal tracking-tight">
          Thank You For Your Order
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          Your pieces have been allocated and our master atelier has begun packaging your garments in bespoke garment covers.
        </p>

        {/* Order ID Pill with Copy */}
        <div className="pt-2 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500">Order Reference:</span>
          <code className="text-xs font-mono font-semibold text-luna-charcoal px-3 py-1 bg-luna-sand/70 rounded-full border border-gray-200">
            {order.id}
          </code>
          <button
            onClick={handleCopyId}
            className="p-1 text-gray-400 hover:text-luna-gold-700 transition-colors"
            title="Copy Order ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Order Details Card */}
      <div className="bg-white rounded-2xl border border-luna-sand p-6 sm:p-8 shadow-sm space-y-8">
        
        {/* Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 block mb-1">Status</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-[11px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {order.status || 'PENDING'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Order Date</span>
            <span className="font-semibold text-luna-charcoal flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Today'}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Recipient</span>
            <span className="font-semibold text-luna-charcoal truncate block">
              {order.recipientName}
            </span>
          </div>

          <div>
            <span className="text-gray-400 block mb-1">Total Amount</span>
            <span className="font-editorial text-base font-bold text-luna-charcoal block">
              ${Number(order.totalAmount).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="space-y-1 text-xs">
          <span className="text-xs uppercase tracking-widest font-semibold text-gray-400 block mb-1">
            Shipping Destination
          </span>
          <p className="text-gray-800 leading-relaxed font-medium">
            {order.shippingAddressLine}
          </p>
          {order.recipientPhone && (
            <p className="text-gray-500 font-mono text-[11px]">
              Contact Phone: {order.recipientPhone}
            </p>
          )}
        </div>

        {/* Ordered Dress Items Snapshot */}
        <div className="space-y-4">
          <h3 className="text-sm uppercase tracking-widest font-semibold text-luna-charcoal border-b border-gray-100 pb-2">
            Items Reserved ({order.items?.length || 0})
          </h3>

          <div className="divide-y divide-gray-100">
            {order.items?.map((item) => (
              <div key={item.id || item.variantId} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 bg-luna-sand/50 rounded-md border border-gray-100 flex items-center justify-center text-luna-gold-700">
                    <Package className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h4 className="font-editorial text-base font-bold text-luna-charcoal">
                      {item.productName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Size: <span className="font-semibold">{item.size}</span> • Color: {item.color}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Qty: {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
                    </p>
                  </div>
                </div>

                <span className="font-editorial text-base font-bold text-luna-charcoal">
                  ${Number(item.lineTotal || item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-600 font-sans max-w-xs ml-auto">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold text-luna-charcoal">${Number(order.subtotal).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Courier Delivery</span>
            <span className="font-semibold text-luna-charcoal">
              {Number(order.shippingFee) === 0 ? (
                <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">Complimentary</span>
              ) : (
                `$${Number(order.shippingFee).toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 text-luna-charcoal font-editorial font-bold">
            <span className="text-base">Total Paid</span>
            <span className="text-xl font-bold">${Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors shadow-sm"
          >
            <span>View All My Orders</span>
            <ArrowRight className="w-4 h-4 text-luna-gold-300" />
          </Link>

          <Link
            to="/products"
            className="text-xs uppercase tracking-widest font-semibold text-gray-600 hover:text-black transition-colors"
          >
            &larr; Return to Atelier Catalog
          </Link>
        </div>

      </div>

    </div>
  );
}
