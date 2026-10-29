/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luna_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle session expiry and reject HTML fallback responses
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers?.['content-type'] || '';
    if (
      typeof response.data === 'string' &&
      (contentType.includes('text/html') ||
       response.data.trim().startsWith('<!doctype') ||
       response.data.trim().startsWith('<html'))
    ) {
      return Promise.reject(new Error('Received HTML response instead of JSON. Ensure VITE_API_BASE_URL points to the backend API Gateway.'));
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      const currentToken = localStorage.getItem('luna_token');
      if (currentToken) {
        localStorage.removeItem('luna_token');
        localStorage.removeItem('luna_user');
        window.dispatchEvent(new Event('luna-auth-changed'));
      }
    }
    return Promise.reject(error);
  }
);

// Product Service Endpoints
export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getVariantById: (variantId) => api.get(`/products/variants/${variantId}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addVariant: (productId, data) => api.post(`/products/${productId}/variants`, data),
  adjustStock: (variantId, data) => api.patch(`/products/variants/${variantId}/stock`, data),
};

// User Service & Auth Endpoints
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/account'),
  updateProfile: (data) => api.put('/account', data),
  getAddresses: () => api.get('/account/addresses'),
  addAddress: (data) => api.post('/account/addresses', data),
  deleteAddress: (id) => api.delete(`/account/addresses/${id}`),
};

// Order Service Endpoints
export const orderService = {
  placeOrder: (data) => api.post('/orders', data),
  getMyOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`),
  adminGetOrders: (params) => api.get('/admin/orders', { params }),
  adminUpdateStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
};

export default api;
