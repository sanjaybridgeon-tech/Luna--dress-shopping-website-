/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-luna-cream font-sans selection:bg-luna-gold-200 selection:text-luna-slate-900">
      {/* Global Navigation */}
      <Navbar />

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Main Page Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
