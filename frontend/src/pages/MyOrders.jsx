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
  Package, 
  Calendar, 
  MapPin, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  XCircle, 
  ArrowRight, 
  AlertCircle,
  Truck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await orderService.getMyOrders();
      const data = res.data;
      if (data && data.content) {
        setOrders(data.content);
        // Expand first order by default if available
        if (data.content.length > 0 && !expandedOrderId) {
          setExpandedOrderId(data.content[0].id);
        }
      } else if (Array.isArray(data)) {
        setOrders(data);
        if (data.length > 0 && !expandedOrderId) {
          setExpandedOrderId(data[0].id);
        }
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
      setErrorMessage(
        err.response?.data?.detail || 'Unable to retrieve your order history. Please check gateway connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you wish to cancel this order? Stock will be automatically replenished.')) {
      return;
    }

    setCancellingId(orderId);
    setActionSuccessMessage('');
    setErrorMessage('');

    try {
      const res = await orderService.cancelOrder(orderId);
      const updatedOrder = res.data;

      // Update in local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updatedOrder.status || 'CANCELLED' } : o))
      );

      setActionSuccessMessage(`Order ${orderId.slice(0, 8)}... has been cancelled and inventory replenished.`);
      setTimeout(() => setActionSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Failed to cancel order', err);
      const msg = err.response?.data?.detail || 'Unable to cancel order. Only PENDING orders can be cancelled.';
      setErrorMessage(msg);
    } finally {
      setCancellingId(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold uppercase tracking-wider border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Awaiting Dispatch
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold uppercase tracking-wider border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" />
            In Transit with Courier
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold uppercase tracking-wider border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold uppercase tracking-wider border border-gray-200">
            <XCircle className="w-3 h-3 text-gray-500" />
            Cancelled &amp; Restocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans">
      
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-luna-gold-700">Home</Link>
        <span>/</span>
        <span className="text-luna-charcoal font-medium">Customer Portal</span>
        <span>/</span>
        <span className="text-luna-gold-700 font-semibold">Order History</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-gray-200 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-luna-gold-700 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Client Portfolio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal">
            My Order History
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Logged in as <strong>{user?.fullName || user?.email}</strong>
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="text-xs text-luna-gold-700 hover:text-luna-gold-900 font-semibold uppercase tracking-wider transition-colors self-start sm:self-auto"
        >
          Refresh Orders &rarr;
        </button>
      </div>

      {/* Feedback Alerts */}
      {actionSuccessMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl p-6 h-36" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="text-center py-24 bg-white rounded-3xl border border-luna-sand p-8 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-luna-sand/70 flex items-center justify-center mx-auto text-luna-gold-600">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-editorial font-bold text-luna-charcoal">
            No Orders on File
          </h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            You have not placed any orders yet. Discover our curated eveningwear and silk slips to begin your portfolio.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors shadow-sm"
          >
            <span>Explore The Collection</span>
            <ArrowRight className="w-4 h-4 text-luna-gold-300" />
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const itemCount = order.items?.length || 0;
            const isCancellable = order.status === 'PENDING';

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-luna-sand overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300"
              >
                {/* Header Row */}
                <div 
                  onClick={() => toggleExpand(order.id)}
                  className="p-6 bg-white cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs font-bold text-luna-charcoal">
                        Ref #{order.id.slice(0, 8)}...
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyId(order.id);
                        }}
                        className="text-gray-400 hover:text-luna-gold-700 p-1"
                        title="Copy full UUID"
                      >
                        {copiedId === order.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                      <span>•</span>
                      <span>{itemCount} {itemCount === 1 ? 'Design' : 'Designs'}</span>
                      <span>•</span>
                      <span className="truncate max-w-xs text-gray-600">
                        To: {order.recipientName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-0 border-gray-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Total Due</span>
                      <span className="font-editorial text-xl font-bold text-luna-charcoal">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>

                    <div className="p-2 rounded-full hover:bg-luna-sand text-gray-400 hover:text-black transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-6 bg-luna-cream/40 space-y-6 animate-fadeIn">
                    
                    {/* Destination Banner */}
                    <div className="flex items-start gap-2.5 text-xs text-gray-700 bg-white p-4 rounded-xl border border-gray-100">
                      <MapPin className="w-4 h-4 text-luna-gold-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-luna-charcoal mb-0.5">Shipping Destination</strong>
                        <span>{order.shippingAddressLine}</span>
                        {order.recipientPhone && (
                          <span className="block text-gray-400 text-[11px] font-mono mt-0.5">
                            Courier Contact: {order.recipientPhone}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Item Snapshots */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-widest font-semibold text-gray-500">
                        Item Snapshots Recorded At Checkout
                      </h4>

                      <div className="divide-y divide-gray-100 bg-white rounded-xl border border-gray-100 p-4">
                        {order.items?.map((item) => (
                          <div key={item.id || item.variantId} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-luna-sand/50 rounded flex items-center justify-center text-luna-gold-700">
                                <Package className="w-5 h-5 stroke-[1.5]" />
                              </div>
                              <div>
                                <h5 className="font-editorial text-base font-bold text-luna-charcoal">
                                  {item.productName}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  Size {item.size} • {item.color}
                                </p>
                                <p className="text-[11px] text-gray-400">
                                  Qty {item.quantity} × ${Number(item.unitPrice).toFixed(2)}
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

                    {/* Breakdown & Actions Strip */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-gray-200 gap-4">
                      <div className="flex items-center gap-6 text-xs text-gray-600">
                        <div>
                          <span className="text-gray-400 block">Subtotal</span>
                          <span className="font-semibold text-luna-charcoal">${Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Courier Delivery</span>
                          <span className="font-semibold text-luna-charcoal">
                            {Number(order.shippingFee) === 0 ? 'Complimentary' : `$${Number(order.shippingFee).toFixed(2)}`}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block">Total</span>
                          <span className="font-editorial text-lg font-bold text-luna-charcoal">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Cancel Order Action */}
                      {isCancellable && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="px-5 py-2.5 rounded-full border border-rose-300 text-rose-700 text-xs font-semibold uppercase tracking-wider hover:bg-rose-50 hover:border-rose-400 transition-colors self-start sm:self-auto disabled:opacity-50"
                        >
                          {cancellingId === order.id ? 'Restocking Inventory...' : 'Cancel Order'}
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
