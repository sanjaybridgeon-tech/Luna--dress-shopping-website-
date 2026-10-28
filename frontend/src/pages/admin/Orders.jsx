/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  RefreshCw, 
  Calendar, 
  MapPin, 
  Check, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy
} from 'lucide-react';
import { orderService } from '../../services/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const fetchAdminOrders = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const params = {};
      if (selectedStatus) params.status = selectedStatus;

      const res = await orderService.adminGetOrders(params);
      const data = res.data;
      if (data && data.content) {
        setOrders(data.content);
      } else if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Failed to load admin orders', err);
      setErrorMessage(
        err.response?.data?.detail || 'Failed to load client orders. Verify Admin JWT authentication.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, [selectedStatus]);

  const handleStatusTransition = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setFeedback('');
    setErrorMessage('');

    try {
      const res = await orderService.adminUpdateStatus(orderId, { status: newStatus });
      const updated = res.data;

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o))
      );

      setFeedback(`Order status transitioned to ${newStatus}.`);
      setTimeout(() => setFeedback(''), 4000);
    } catch (err) {
      console.error('Failed to update status', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
            <Check className="w-3 h-3 text-indigo-600" />
            Confirmed
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-bold uppercase tracking-wider border border-blue-200">
            <Truck className="w-3 h-3 text-blue-600" />
            Shipped
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Delivered
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider border border-gray-200">
            <XCircle className="w-3 h-3 text-gray-500" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
            {status}
          </span>
        );
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase())
      || (o.recipientName && o.recipientName.toLowerCase().includes(searchTerm.toLowerCase()))
      || (o.shippingAddressLine && o.shippingAddressLine.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-editorial font-bold text-luna-charcoal">
            Client Order Fulfillment
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track customer orders across microservices, inspect item snapshots, and transition shipment statuses.
          </p>
        </div>

        <button
          onClick={fetchAdminOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Alerts */}
      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedback}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by order ID, recipient name, address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-luna-gold-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs text-gray-500">Status Filter:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-luna-gold-500 font-medium"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Dispatch</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SHIPPED">In Transit (Shipped)</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-gray-100">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client Recipient</th>
                <th className="py-3 px-4">Total Paid</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Transition Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-luna-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Loading orders queue...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    No client orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isExpanded = expandedId === order.id;
                  const isTerminal = order.status === 'CANCELLED' || order.status === 'DELIVERED';

                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-gray-50/80 transition-colors">
                        
                        {/* Reference UUID */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : order.id)}
                              className="p-1 text-gray-400 hover:text-black rounded"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <span className="font-mono font-bold text-xs">
                              {order.id.slice(0, 8)}...
                            </span>
                            <button
                              onClick={() => handleCopyId(order.id)}
                              className="text-gray-400 hover:text-luna-gold-700"
                              title="Copy UUID"
                            >
                              {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-gray-500 font-medium">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-luna-charcoal">{order.recipientName}</p>
                          <p className="text-[11px] text-gray-400 truncate max-w-xs">{order.shippingAddressLine}</p>
                        </td>

                        <td className="py-3.5 px-4 font-editorial font-bold text-sm">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(order.status)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <select
                            disabled={updatingId === order.id || isTerminal}
                            value={order.status}
                            onChange={(e) => handleStatusTransition(order.id, e.target.value)}
                            className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg bg-white font-medium focus:outline-none focus:border-luna-gold-500 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>

                      </tr>

                      {/* Expandable Order Items Row */}
                      {isExpanded && (
                        <tr className="bg-luna-sand/20">
                          <td colSpan={6} className="py-4 px-8">
                            <div className="space-y-2">
                              <h5 className="text-[11px] uppercase tracking-wider font-bold text-gray-500">
                                Reserved Items Snapshots ({order.items?.length || 0})
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {order.items?.map((item) => (
                                  <div key={item.id} className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between text-xs">
                                    <div>
                                      <p className="font-editorial font-bold text-sm text-luna-charcoal">{item.productName}</p>
                                      <p className="text-gray-500 text-[11px]">Size: {item.size} • Color: {item.color}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold text-luna-charcoal">${Number(item.unitPrice).toFixed(2)} × {item.quantity}</p>
                                      <p className="font-editorial font-bold text-luna-gold-800">${Number(item.lineTotal).toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
