/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  LogOut, 
  Package, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'All Creations', path: '/products' },
    { name: 'Evening & Gala', path: '/products?category=evening-dresses' },
    { name: 'Cocktail & Party', path: '/products?category=cocktail-party' },
    { name: 'Summer Linens', path: '/products?category=casual-summer-dresses' },
    { name: 'Unisex Drape', path: '/products?gender=UNISEX' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-luna-slate-950 text-luna-gold-300 text-[11px] uppercase tracking-widest py-2 px-4 text-center font-sans border-b border-luna-gold-700/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="hidden md:inline-block text-gray-400">
            Atelier Privé — Milan • Paris • New York
          </span>
          <span className="mx-auto md:mx-0 flex items-center justify-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-luna-gold-400 inline" />
            <span>Complimentary Courier Delivery On Orders Over $150</span>
          </span>
          <span className="hidden md:inline-block text-gray-400">
            Secure Payment Gateway
          </span>
        </div>
      </div>

      {/* Main Glassmorphic Navigation Bar */}
      <nav className="glass bg-white/90 backdrop-blur-md border-b border-luna-sand transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-luna-charcoal hover:text-luna-gold-600 focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Left Nav Links (Desktop) */}
            <div className="hidden lg:flex items-center space-x-7">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs uppercase tracking-widest font-medium transition-colors hover:text-luna-gold-600 ${
                    location.pathname + location.search === link.path
                      ? 'text-luna-gold-600 font-semibold border-b border-luna-gold-500 pb-0.5'
                      : 'text-gray-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Center Brand Logo */}
            <div className="flex-1 lg:flex-initial text-center">
              <Link to="/" className="inline-block group">
                <span className="font-editorial text-3xl sm:text-4xl font-bold tracking-widest text-luna-charcoal group-hover:text-luna-gold-700 transition-colors uppercase block">
                  L U N A
                </span>
                <span className="block text-[9px] tracking-[0.3em] uppercase text-gray-500 font-sans -mt-1 group-hover:text-luna-gold-600 transition-colors">
                  Haute Atelier
                </span>
              </Link>
            </div>

            {/* Right Nav Links (Desktop) & Action Icons */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              
              {/* Extra desktop link */}
              <div className="hidden lg:flex items-center space-x-7">
                {navLinks.slice(3).map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-luna-gold-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="h-4 w-px bg-gray-200 hidden lg:block" />

              {/* Search Toggle / Form */}
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search gowns, silks, sizes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-48 sm:w-64 px-3 py-1.5 text-xs bg-luna-sand/70 rounded-full border border-gray-200 focus:outline-none focus:border-luna-gold-500 transition-all font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="p-1.5 text-gray-700 hover:text-luna-gold-600 transition-colors"
                    aria-label="Search Catalog"
                  >
                    <Search className="w-5 h-5 stroke-[1.5]" />
                  </button>
                )}
              </div>

              {/* User Account / Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-luna-gold-600 transition-colors p-1"
                    >
                      <div className="w-7 h-7 rounded-full bg-luna-gold-100 text-luna-gold-800 flex items-center justify-center font-bold text-xs uppercase border border-luna-gold-300">
                        {user?.fullName ? user.fullName.charAt(0) : 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {userDropdownOpen && (
                      <div 
                        className="absolute right-0 mt-3 w-56 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-50 animate-fadeIn"
                        onMouseLeave={() => setUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-gray-100">
                          <p className="text-xs font-semibold text-luna-charcoal truncate">
                            {user?.fullName || 'Customer'}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-700 hover:bg-luna-sand/50 hover:text-luna-gold-700 transition-colors"
                        >
                          <Package className="w-4 h-4 text-luna-gold-600" />
                          <span>My Order History</span>
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-luna-charcoal bg-amber-50/50 hover:bg-amber-100/50 hover:text-luna-slate-950 font-medium transition-colors"
                          >
                            <ShieldCheck className="w-4 h-4 text-luna-gold-600" />
                            <span>Atelier Admin Console</span>
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-luna-gold-600 transition-colors"
                  >
                    <User className="w-5 h-5 stroke-[1.5]" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                )}
              </div>

              {/* Cart Icon with Live Count Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-1.5 text-gray-800 hover:text-luna-gold-600 transition-colors"
                aria-label="Open Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luna-gold-500 text-white font-sans text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs uppercase tracking-widest font-medium text-gray-700 hover:text-luna-gold-600 py-1.5"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-3 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Signed in as <strong>{user?.fullName}</strong></div>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-xs text-luna-gold-700 font-medium py-1"
                  >
                    View Order History
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-xs font-semibold text-amber-700 py-1"
                    >
                      ★ Atelier Admin Console
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="block text-xs text-rose-600 py-1"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-xs uppercase tracking-widest text-luna-charcoal font-semibold py-1"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
