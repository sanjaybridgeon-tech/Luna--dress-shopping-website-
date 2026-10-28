/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Check, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-luna-slate-950 text-white border-t border-luna-slate-800">
      
      {/* Upper Newsletter & Brand Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          
          {/* Column 1 & 2: Brand Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-editorial text-3xl font-bold tracking-[0.25em] text-white uppercase block">
                L U N A
              </span>
              <span className="text-[10px] tracking-[0.35em] uppercase text-luna-gold-400 font-sans block mt-1">
                Haute Atelier • Est. 2026
              </span>
            </Link>

            <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-sm">
              Dedicated to timeless silhouettes, draped mulberry silks, sumptuous midnight velvets, and effortless summer linens. Designed for the discerning wardrobe.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-luna-gold-300">
              <Sparkles className="w-3.5 h-3.5 text-luna-gold-400" />
              <span className="font-editorial tracking-wide">Bespoke luxury handcrafted with pure materials.</span>
            </div>
          </div>

          {/* Column 3: The Collections */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-luna-gold-300 mb-4 font-sans">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>
                <Link to="/products?category=evening-dresses" className="hover:text-white transition-colors">
                  Evening &amp; Gala Gowns
                </Link>
              </li>
              <li>
                <Link to="/products?category=cocktail-party" className="hover:text-white transition-colors">
                  Cocktail &amp; Partywear
                </Link>
              </li>
              <li>
                <Link to="/products?category=casual-summer-dresses" className="hover:text-white transition-colors">
                  Casual Summer Linens
                </Link>
              </li>
              <li>
                <Link to="/products?category=maxi-midi-dresses" className="hover:text-white transition-colors">
                  Maxi &amp; Midi Silhouettes
                </Link>
              </li>
              <li>
                <Link to="/products?gender=UNISEX" className="hover:text-white transition-colors">
                  Unisex Heritage Tunics
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Concierge */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-luna-gold-300 mb-4 font-sans">
              Concierge
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-sans">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Complimentary Shipping Over $150
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  30-Day Atelier Returns
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Size &amp; Fit Consultation
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Silk Care &amp; Preservation
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Order Tracking &amp; Support
                </span>
              </li>
            </ul>
          </div>

          {/* Column 5: Private Previews (Newsletter) */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-luna-gold-300 mb-4 font-sans">
              Private Previews
            </h4>
            <p className="text-xs text-gray-400 mb-4 font-sans">
              Receive private invitations to seasonal collections and limited-run dress drops.
            </p>

            {subscribed ? (
              <div className="bg-luna-slate-900 border border-luna-gold-600/30 rounded-lg p-3 text-xs text-luna-gold-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>You are on the Atelier Guestlist.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-luna-slate-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-luna-gold-400 font-sans"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-luna-gold-500 hover:bg-luna-gold-400 text-luna-slate-950 text-xs font-semibold rounded-md transition-colors flex items-center"
                    aria-label="Subscribe"
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-gray-500 block">
                  Strictly confidential. Unsubscribe at any time.
                </span>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Bottom Legal & Architecture Ribbon */}
      <div className="border-t border-luna-slate-900 bg-black/40 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} LUNA Haute Couture Atelier. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-2 bg-luna-slate-900/80 px-3 py-1 rounded-full border border-luna-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-luna-gold-400" />
            <span className="text-gray-400">Spring Cloud Gateway • Isolated Microservices DBs</span>
          </div>

          <div className="flex space-x-6">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-300 cursor-pointer">Atelier Cookies</span>
          </div>

        </div>
      </div>

    </footer>
  );
}
