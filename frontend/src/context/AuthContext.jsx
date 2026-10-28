/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('luna_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('luna_token') || null);
  const [loading, setLoading] = useState(false);

  // Sync state if storage changes across tabs or 401 occurs
  useEffect(() => {
    const handleAuthChange = () => {
      const savedToken = localStorage.getItem('luna_token');
      const savedUser = localStorage.getItem('luna_user');
      setToken(savedToken || null);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener('luna-auth-changed', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('luna-auth-changed', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      const authData = response.data;
      const u = authData.user || {};
      
      const userData = {
        id: u.id || authData.userId,
        email: u.email || authData.email,
        fullName: u.name || authData.fullName || 'Client',
        role: u.role || authData.role || 'CUSTOMER',
      };

      localStorage.setItem('luna_token', authData.token);
      localStorage.setItem('luna_user', JSON.stringify(userData));

      setToken(authData.token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (err) {
      let message = err.response?.data?.detail || err.response?.data?.message || 'Login failed. Please verify credentials.';
      if (err.response?.data?.errors) {
        const errorList = Object.values(err.response.data.errors);
        if (errorList.length > 0) message = errorList.join('. ');
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      const authData = response.data;
      const u = authData.user || {};

      const loggedUser = {
        id: u.id || authData.userId,
        email: u.email || authData.email,
        fullName: u.name || authData.fullName || 'Client',
        role: u.role || authData.role || 'CUSTOMER',
      };

      localStorage.setItem('luna_token', authData.token);
      localStorage.setItem('luna_user', JSON.stringify(loggedUser));

      setToken(authData.token);
      setUser(loggedUser);
      return { success: true, user: loggedUser };
    } catch (err) {
      let message = err.response?.data?.detail || err.response?.data?.message || 'Registration failed.';
      if (err.response?.data?.errors) {
        const errorList = Object.values(err.response.data.errors);
        if (errorList.length > 0) message = errorList.join('. ');
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('luna_token');
    localStorage.removeItem('luna_user');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('luna-auth-changed'));
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
