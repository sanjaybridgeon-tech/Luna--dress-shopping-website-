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
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email address and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    } else {
      setErrorMessage(result.error);
    }
  };

  const handleDemoFill = () => {
    setEmail('elena.rostova@example.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl border border-luna-sand p-8 sm:p-10 shadow-luxury space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-luna-gold-100 text-luna-gold-800 text-[10px] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3 h-3 text-luna-gold-600" />
            <span>Atelier Client Access</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-editorial font-bold text-luna-charcoal tracking-tight">
            Welcome Back
          </h1>

          <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
            Sign in to access your bespoke orders, saved delivery addresses, and private previews.
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
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          <div>
            <label className="block text-gray-600 font-medium mb-1.5">
              Email Address
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-gray-600 font-medium">
                Password
              </label>
              <span className="text-[11px] text-luna-gold-700 hover:text-luna-gold-900 cursor-pointer">
                Forgot password?
              </span>
            </div>
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

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-full bg-luna-slate-900 text-white font-sans text-xs uppercase tracking-[0.2em] font-semibold hover:bg-luna-gold-600 transition-all shadow-md hover:shadow-luxury-hover flex items-center justify-center gap-2 group disabled:opacity-60"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4 text-luna-gold-300 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Demo Account Quick-Fill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[11px] text-luna-gold-700 hover:text-luna-gold-900 font-medium underline transition-colors"
            >
              Demo: Autofill Elena Rostova's Credentials
            </button>
          </div>

        </form>

        {/* Footer Link */}
        <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
          <span>New to the Atelier? </span>
          <Link
            to={`/register${redirectPath !== '/' ? `?redirect=${encodeURIComponent(redirectPath)}` : ''}`}
            className="text-luna-charcoal font-semibold hover:text-luna-gold-700 underline"
          >
            Create an Atelier Account
          </Link>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Stateless JWT Authentication via Spring Cloud Gateway</span>
        </div>

      </div>
    </div>
  );
}
