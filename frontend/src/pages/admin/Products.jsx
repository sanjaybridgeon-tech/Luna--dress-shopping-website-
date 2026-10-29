/**
 * ============================================================================
 * L U N A — Haute Couture E-Commerce Frontend
 *
 * Copyright (c) 2026 Luna Atelier. All rights reserved.
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Layers, 
  Check, 
  X, 
  AlertCircle, 
  RefreshCw,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { productService } from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState(null);

  // Form State for Create/Edit Product
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formBrand, setFormBrand] = useState('Luna');
  const [formGender, setFormGender] = useState('WOMEN');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form State for Add Variant
  const [varSize, setVarSize] = useState('S');
  const [varColor, setVarColor] = useState('Champagne Gold');
  const [varSku, setVarSku] = useState('');
  const [varStock, setVarStock] = useState('10');
  const [addingVariant, setAddingVariant] = useState(false);
  const [adjustingStockId, setAdjustingStockId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [prodsRes, catsRes] = await Promise.all([
        productService.getProducts({ size: 50 }),
        productService.getCategories()
      ]);
      setProducts(prodsRes.data?.content || prodsRes.data || []);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error('Failed to load admin products', err);
      setErrorMessage('Failed to load catalog products. Verify Gateway on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormDesc('');
    setFormPrice('189.99');
    setFormBrand('Luna');
    setFormGender('WOMEN');
    setFormCategoryId(categories[0]?.id || '1');
    setFormImageUrl('https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800');
    setProductModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormDesc(prod.description || '');
    setFormPrice(String(prod.price));
    setFormBrand(prod.brand || 'Luna');
    setFormGender(prod.gender || 'WOMEN');
    setFormCategoryId(String(prod.category?.id || '1'));
    setFormImageUrl(prod.imageUrl || '');
    setProductModalOpen(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const selectedCategory = categories.find((c) => String(c.id) === String(formCategoryId));
    const payload = {
      name: formName.trim(),
      description: formDesc.trim(),
      price: parseFloat(formPrice),
      brand: formBrand.trim() || 'Luna',
      gender: formGender,
      categoryId: parseInt(formCategoryId, 10),
      categorySlug: selectedCategory ? selectedCategory.slug : 'evening-dresses',
      imageUrl: formImageUrl.trim(),
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        setFeedbackMessage(`Product "${payload.name}" updated successfully.`);
      } else {
        await productService.createProduct(payload);
        setFeedbackMessage(`New dress "${payload.name}" created in catalog.`);
      }

      setProductModalOpen(false);
      loadData();
      setTimeout(() => setFeedbackMessage(''), 4000);
    } catch (err) {
      console.error('Failed to save product', err);
      let msg = err.response?.data?.detail || err.response?.data?.message || 'Failed to save product changes.';
      if (err.response?.data?.errors) {
        const errorList = Object.entries(err.response.data.errors).map(([field, reason]) => `${field}: ${reason}`);
        if (errorList.length > 0) msg = errorList.join('. ');
      }
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you wish to archive dress "${name}"?`)) return;

    try {
      await productService.deleteProduct(id);
      setFeedbackMessage(`Product "${name}" deactivated.`);
      loadData();
      setTimeout(() => setFeedbackMessage(''), 4000);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Failed to deactivate product.');
    }
  };

  // Variant Modal Handlers
  const openVariantsModal = async (prod) => {
    try {
      // Reload product details to get full variants list
      const res = await productService.getProductById(prod.id);
      setSelectedProductForVariants(res.data);
      setVarSku(`LUNA-${res.data.name.slice(0, 3).toUpperCase()}-S`);
      setVariantModalOpen(true);
    } catch {
      setSelectedProductForVariants(prod);
      setVariantModalOpen(true);
    }
  };

  const handleAddVariantSubmit = async (e) => {
    e.preventDefault();
    setAddingVariant(true);

    const payload = {
      size: varSize,
      color: varColor.trim(),
      sku: varSku.trim().toUpperCase(),
      stockQuantity: parseInt(varStock, 10) || 0,
    };

    try {
      await productService.addVariant(selectedProductForVariants.id, payload);
      // Refresh current product variants
      const res = await productService.getProductById(selectedProductForVariants.id);
      setSelectedProductForVariants(res.data);
      setVarSku('');
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add variant. Ensure SKU is unique.');
    } finally {
      setAddingVariant(false);
    }
  };

  const handleStockAdjustment = async (variantId, delta) => {
    setAdjustingStockId(variantId);
    try {
      const payload = {
        quantityDelta: delta,
        reason: 'Admin manual inventory audit adjustment',
      };
      await productService.adjustStock(variantId, payload);
      // Refresh variants
      const res = await productService.getProductById(selectedProductForVariants.id);
      setSelectedProductForVariants(res.data);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || 'Cannot adjust stock below 0.');
    } finally {
      setAdjustingStockId(null);
    }
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase())
      || (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = !selectedCategory || p.category?.slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Page Title & Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-editorial font-bold text-luna-charcoal">
            Dress Catalog &amp; Inventory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage luxury gowns, silhouettes, size/color variant SKUs, and live stock adjustments.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-luna-gold-600 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-luna-gold-300" />
          <span>Add New Dress</span>
        </button>
      </div>

      {/* Alerts */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search dresses by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-luna-gold-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-luna-gold-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={loadData}
            className="p-2 text-gray-500 hover:text-black rounded-lg border border-gray-200 hover:bg-gray-50"
            title="Refresh Catalog"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-gray-100">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Creation</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Silhouette</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-luna-charcoal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    Loading catalog inventory...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    No dresses found matching filter.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=150'}
                          alt={p.name}
                          className="w-10 h-12 object-cover rounded bg-gray-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-editorial font-bold text-sm text-luna-charcoal">{p.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono truncate max-w-xs">{p.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {p.category?.name || 'Evening'}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        p.gender === 'UNISEX' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {p.gender}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-editorial font-bold text-sm">
                      ${Number(p.price).toFixed(2)}
                    </td>

                    <td className="py-3 px-4 font-semibold">
                      {p.totalStock > 0 ? (
                        <span className="text-emerald-700">{p.totalStock} in stock</span>
                      ) : (
                        <span className="text-rose-600 font-medium">Out of stock</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        p.active !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {p.active !== false ? 'Active' : 'Archived'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openVariantsModal(p)}
                          className="p-1.5 text-luna-gold-700 hover:bg-luna-gold-50 rounded"
                          title="Manage Variants & Stock"
                        >
                          <Layers className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded"
                          title="Edit Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="Archive Dress"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create / Edit Product */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-editorial text-2xl font-bold text-luna-charcoal">
                {editingProduct ? 'Edit Atelier Creation' : 'Create New Dress'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-600 font-medium mb-1">Dress Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Aurelia Silk Slip Dress"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-luna-gold-500"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Mulberry silk bias-cut draped neckline..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-luna-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-luna-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-luna-gold-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Silhouette Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-luna-gold-500"
                  >
                    <option value="WOMEN">WOMEN</option>
                    <option value="UNISEX">UNISEX</option>
                    <option value="MEN">MEN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-medium mb-1">Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-luna-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-medium mb-1">High-Res Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-luna-gold-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-semibold uppercase tracking-wider hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-luna-slate-900 text-white font-semibold uppercase tracking-wider hover:bg-luna-gold-600 transition-colors shadow-sm disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Dress'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Manage Variants & Atomic Stock Adjustments (Task 6.3) */}
      {variantModalOpen && selectedProductForVariants && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 animate-fadeIn">
            
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-luna-gold-700 font-bold">
                  Variant Matrix &amp; Inventory Audit
                </span>
                <h3 className="font-editorial text-2xl font-bold text-luna-charcoal mt-0.5">
                  {selectedProductForVariants.name}
                </h3>
              </div>
              <button
                onClick={() => setVariantModalOpen(false)}
                className="text-gray-400 hover:text-black p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Variants Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Existing SKUs ({selectedProductForVariants.variants?.length || 0})
              </h4>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs divide-y divide-gray-100">
                  <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Size</th>
                      <th className="py-2.5 px-3">Color</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Live Stock</th>
                      <th className="py-2.5 px-3 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-luna-charcoal">
                    {selectedProductForVariants.variants?.map((v) => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="py-2.5 px-3 font-bold">{v.size}</td>
                        <td className="py-2.5 px-3 text-gray-600">{v.color}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-gray-500">{v.sku}</td>
                        <td className="py-2.5 px-3 font-semibold text-emerald-700">
                          {v.stockQuantity} units
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleStockAdjustment(v.id, -1)}
                              disabled={adjustingStockId === v.id || v.stockQuantity <= 0}
                              className="w-6 h-6 rounded bg-gray-100 hover:bg-rose-100 text-gray-700 hover:text-rose-700 flex items-center justify-center font-bold text-xs disabled:opacity-40"
                              title="Decrement Stock (-1)"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleStockAdjustment(v.id, 5)}
                              disabled={adjustingStockId === v.id}
                              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 font-bold text-[10px]"
                              title="Restock (+5 units)"
                            >
                              +5
                            </button>
                            <button
                              onClick={() => handleStockAdjustment(v.id, 10)}
                              disabled={adjustingStockId === v.id}
                              className="px-2 py-0.5 rounded bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-700 font-bold text-[10px]"
                              title="Restock (+10 units)"
                            >
                              +10
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Variant Form */}
            <form onSubmit={handleAddVariantSubmit} className="pt-4 border-t border-gray-100 space-y-3 text-xs bg-luna-sand/30 p-4 rounded-2xl">
              <h4 className="font-semibold text-gray-800 uppercase tracking-wider text-[11px]">
                Add New Size / Color Variant
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">Size</label>
                  <select
                    value={varSize}
                    onChange={(e) => setVarSize(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 bg-white"
                  >
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                      <option key={sz} value={sz}>{sz}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">Colorway</label>
                  <input
                    type="text"
                    required
                    value={varColor}
                    onChange={(e) => setVarColor(e.target.value)}
                    placeholder="e.g. Midnight Black"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={varSku}
                    onChange={(e) => setVarSku(e.target.value)}
                    placeholder="LUNA-DRE-BLK-S"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block text-gray-500 text-[11px] mb-1">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={varStock}
                    onChange={(e) => setVarStock(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={addingVariant}
                  className="px-4 py-2 rounded-lg bg-luna-slate-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-luna-gold-600 transition-colors disabled:opacity-60"
                >
                  {addingVariant ? 'Creating SKU...' : '+ Add Variant SKU'}
                </button>
              </div>
            </form>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setVariantModalOpen(false)}
                className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase tracking-wider hover:bg-gray-200"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
