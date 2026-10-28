/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    const payload = {
      name: fullName.trim(),
      email: email.trim(),
      password,
      phone: phoneNumber.trim() || null,
    };

    const result = await register(payload);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.error);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-luna-sand p-8 sm:p-10 shadow-luxury space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luna-gold-100 text-luna-gold-800 text-[10px] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3 h-3 text-luna-gold-600" />
            <span>Join The Atelier</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal tracking-tight">
            Create Client Account
          </h1>

          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            Enjoy priority order reservation, complimentary returns, and private preview access.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="flex-1">{errorMessage}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena.rostova@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1-555-0199"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Password * (minimum 8 characters)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-luna-sand/30 text-luna-charcoal focus:outline-none focus:border-luna-gold-500 font-sans"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-luna-slate-900 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-luna-gold-600 transition-all shadow-md hover:shadow-luxury-hover flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {loading ? (
              <span>Creating Client Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4 text-luna-gold-300 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

        </form>

        {/* Footer Link */}
        <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>Already registered with Luna? </span>
          <Link
            to={`/login${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="text-luna-charcoal font-semibold hover:text-luna-gold-700 underline"
          >
            Sign In Here
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>BCrypt Encryption &amp; Isolated `luna_users` Database</span>
        </div>

      </div>
    </div>
  );
}
