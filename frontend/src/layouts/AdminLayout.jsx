/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  BarChart3, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', path: '/admin', icon: BarChart3, exact: true },
    { name: 'Products & Inventory', path: '/admin/products', icon: Layers },
    { name: 'Client Orders', path: '/admin/orders', icon: Package },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-luna-sand/30 font-sans flex text-luna-charcoal">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-luna-slate-950 text-white flex flex-col justify-between border-r border-luna-slate-800 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-luna-slate-800 flex items-center justify-between">
            <Link to="/admin" className="block">
              <span className="font-editorial text-2xl font-bold tracking-[0.25em] text-white uppercase block">
                L U N A
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-luna-gold-400 font-sans block mt-0.5">
                Admin Console
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-luna-gold-500 text-luna-slate-950 font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-white hover:bg-luna-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-luna-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-luna-slate-900 hover:bg-luna-slate-800 text-xs text-luna-gold-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Storefront</span>
            </span>
            <span className="text-[10px] text-gray-500">&rarr;</span>
          </Link>

          <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400">
            <div className="truncate pr-2">
              <p className="font-semibold text-white truncate text-[11px]">{user?.fullName || 'Atelier Admin'}</p>
              <p className="text-[10px] text-luna-gold-400 truncate font-mono">ADMIN ROLE</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-black p-1.5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-luna-charcoal uppercase tracking-wider text-[11px]">
                Atelier Administration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-sans">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gateway 8080 Active</span>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
