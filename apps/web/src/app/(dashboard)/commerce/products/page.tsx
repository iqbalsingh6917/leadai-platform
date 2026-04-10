'use client';

import { useState } from 'react';
import { ShoppingBag, Plus, Edit2, Trash2, X, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  isActive: boolean;
  imageUrl?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'LeadAI Starter Pack', description: 'Perfect for small businesses', price: 2999, currency: 'INR', stock: 999, isActive: true },
  { id: '2', name: 'CRM Training Course', description: 'Complete sales training program', price: 4999, currency: 'INR', stock: 50, isActive: true },
  { id: '3', name: 'Sales Script Templates', description: '50+ proven sales scripts', price: 999, currency: 'INR', stock: 100, isActive: true },
  { id: '4', name: 'Enterprise License', description: 'Annual enterprise subscription', price: 99999, currency: 'INR', stock: 10, isActive: false },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', currency: 'INR', stock: '', isActive: true });

  const handleSubmit = () => {
    const product: Product = {
      id: editing?.id ?? Date.now().toString(),
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      currency: form.currency,
      stock: parseInt(form.stock),
      isActive: form.isActive,
    };
    if (editing) {
      setProducts((p) => p.map((x) => (x.id === editing.id ? product : x)));
    } else {
      setProducts((p) => [product, ...p]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: '', description: '', price: '', currency: 'INR', stock: '', isActive: true });
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), currency: p.currency, stock: String(p.stock), isActive: p.isActive });
    setShowForm(true);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Products</h1>
            <p className="text-slate-500 text-sm">Manage your product catalog</p>
          </div>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-slate-400" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-slate-900 text-sm">{p.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {p.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">₹{p.price.toLocaleString()}</span>
                <span className="text-xs text-slate-500">{p.stock} in stock</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs text-slate-700">
                  <Edit2 className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => setProducts((ps) => ps.filter((x) => x.id !== p.id))}
                  className="flex items-center justify-center px-2 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-xs text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="font-semibold text-lg">{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {(['name', 'description'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1 capitalize">{field}</label>
                  <input
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" value={form.stock} onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded" />
                <label htmlFor="active" className="text-sm text-slate-700">Active</label>
              </div>
              <button onClick={handleSubmit} className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">
                {editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
