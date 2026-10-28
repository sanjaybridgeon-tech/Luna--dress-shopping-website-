/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export default function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-sans text-xs text-gray-400">
        Authenticating Atelier Administrator Privileges...
      </div>
    );
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirectUrl}`} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-luna-cream flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-rose-200 shadow-luxury space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-editorial font-bold text-luna-charcoal">
            Restricted Atelier Portal
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            The account <strong>{user?.email}</strong> does not possess <code className="font-mono text-rose-600">ADMIN</code> privileges. Only authorized managers can access product and order controls.
          </p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center px-6 py-2.5 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-widest hover:bg-luna-gold-600 transition-colors"
            >
              Return to Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}
