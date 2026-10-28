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
  BarChart3, 
  Package, 
  Layers, 
  DollarSign, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  Sparkles, 
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { productService, orderService } from '../../services/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setError('');
      const [prodsRes, ordersRes] = await Promise.all([
        productService.getProducts({ size: 100 }),
        orderService.adminGetOrders({ size: 50 })
      ]);

      const prodsList = prodsRes.data?.content || prodsRes.data || [];
      const ordersList = ordersRes.data?.content || ordersRes.data || [];

      setProducts(prodsList);
      setOrders(ordersList);
    } catch (err) {
      console.error('Failed to load dashboard metrics', err);
      setError(err.response?.data?.detail || 'Failed to fetch atelier analytics. Ensure you are signed in as an administrator.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  // Calculations
  const totalProducts = products.length;

  // Variants stock calculation: count variants with stock <= 5
  const lowStockItems = [];
  products.forEach(p => {
    if (p.variants && p.variants.length > 0) {
      p.variants.forEach(v => {
        if (v.stock_quantity <= 5) {
          lowStockItems.push({
            productId: p.id,
            productName: p.name,
            variantId: v.id,
            size: v.size,
            color: v.color,
            sku: v.sku,
            stock: v.stock_quantity,
          });
        }
      });
    }
  });

  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'CONFIRMED');
  
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CONFIRMED':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 font-sans">
        <RefreshCw className="w-8 h-8 text-luna-gold-500 animate-spin" />
        <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">
          Compiling Maison Metrics & Atelier Analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-luna-gold-100 text-luna-slate-900 border border-luna-gold-300">
              <ShieldCheck className="w-3 h-3 text-luna-gold-600" />
              Executive Control
            </span>
            <span className="text-xs text-gray-400 font-mono">Live Synchronized</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-editorial font-bold text-luna-charcoal tracking-wide">
            Atelier Executive Overview
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time monitoring across haute couture inventory, client acquisitions, and fulfillment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-luna-charcoal hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-luna-gold-600' : 'text-gray-400'}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>
          
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-luna-slate-950 text-white hover:bg-luna-gold-600 shadow-luxury transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-luna-gold-400" />
            <span>Manage Catalog</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Gross Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-100/50 via-transparent to-transparent -mr-6 -mt-6 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Gross Acquisitions
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-editorial font-bold text-luna-charcoal">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Excludes cancelled bespoke requests</span>
          </div>
        </div>

        {/* Total Catalog Creations */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/50 via-transparent to-transparent -mr-6 -mt-6 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Curated Creations
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-editorial font-bold text-luna-charcoal">
            {totalProducts}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Active silhouette lines in catalog
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-100/50 via-transparent to-transparent -mr-6 -mt-6 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Pending Fulfillment
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-editorial font-bold text-luna-charcoal">
            {pendingOrders.length}
          </div>
          <div className="mt-2 text-[11px] text-purple-600 font-medium">
            Requires atelier packaging / dispatch
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-100/50 via-transparent to-transparent -mr-6 -mt-6 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Stock Warnings
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              lowStockItems.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-editorial font-bold ${
            lowStockItems.length > 0 ? 'text-rose-600' : 'text-emerald-700'
          }`}>
            {lowStockItems.length}
          </div>
          <div className="mt-2 text-[11px] text-gray-400">
            Variants with &le; 5 atelier units left
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Client Orders (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-editorial font-bold text-luna-charcoal">
                Recent Client Orders
              </h2>
              <p className="text-xs text-gray-400">
                Latest acquisition activities submitted via storefront gateway
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs text-luna-gold-600 hover:text-luna-gold-700 font-semibold flex items-center gap-1 group"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs">
              No client orders recorded yet in the system.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-widest text-[10px]">
                    <th className="pb-3 font-semibold">Reference</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Total</th>
                    <th className="pb-3 font-semibold">Timestamp</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 font-mono text-[11px] text-luna-charcoal font-medium">
                        {ord.id.substring(0, 8)}...
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(ord.status)}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-luna-charcoal">
                        ${Number(ord.total_amount).toFixed(2)}
                      </td>
                      <td className="py-3.5 text-gray-400">
                        {ord.created_at ? new Date(ord.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link
                          to="/admin/orders"
                          className="text-luna-gold-600 hover:underline font-semibold"
                        >
                          Inspect &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Watchlist (1 col) */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-editorial font-bold text-luna-charcoal">
                  Low Stock Watchlist
                </h2>
                <p className="text-xs text-gray-400">
                  Variants needing immediate atelier replenishment
                </p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                {lowStockItems.length} Critical
              </span>
            </div>

            {lowStockItems.length === 0 ? (
              <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-xs font-semibold text-emerald-800">
                  Optimal Inventory Levels
                </p>
                <p className="text-[11px] text-emerald-600">
                  All bespoke silhouette variants are safely stocked above minimum thresholds.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {lowStockItems.slice(0, 6).map((item) => (
                  <div
                    key={item.variantId}
                    className="p-3 bg-gray-50 hover:bg-amber-50/50 rounded-xl border border-gray-100 flex items-center justify-between transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-luna-charcoal truncate">
                        {item.productName}
                      </p>
                      <p className="text-[10px] text-gray-500 flex items-center gap-1.5">
                        <span>Size: <strong className="text-gray-700">{item.size}</strong></span>
                        <span>•</span>
                        <span>{item.color}</span>
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.stock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-luna-slate-900 hover:text-white border border-gray-200 transition-colors"
            >
              <span>Replenish In Inventory Manager</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
