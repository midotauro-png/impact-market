"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { productsByVendor } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";
import type { Product } from "@/lib/types";

const DEMO_VENDOR_ID = "v-burhan";

const EMPTY: Partial<Product> = {
  name: "", description: "", price_fils: 0, stock: 0, images: [], is_active: true,
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState(productsByVendor(DEMO_VENDOR_ID));
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [showForm, setShowForm] = useState(false);

  function save() {
    if (!editing?.name) return;
    if (editing.id) {
      setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...editing } as Product : p));
    } else {
      setProducts((prev) => [...prev, { ...EMPTY, ...editing, id: `p-${Date.now()}`, vendor_id: DEMO_VENDOR_ID, category_id: "cat-bahraini-food", created_at: new Date().toISOString() } as Product]);
    }
    setEditing(null);
    setShowForm(false);
  }

  function toggle(id: string) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  function del(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink">Products ({products.length})</h2>
        <button className="btn-primary" onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }}>
          <Plus size={15} /> Add Product
        </button>
      </div>

      {/* Form */}
      {showForm && editing && (
        <div className="card p-5 space-y-3 border-orange-200 border">
          <h3 className="font-bold text-ink">{editing.id ? "Edit Product" : "New Product"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="form-group">
              <label className="label">Name</label>
              <input className="input" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Price (fils)</label>
              <input type="number" className="input" value={editing.price_fils ?? 0} onChange={(e) => setEditing({ ...editing, price_fils: Number(e.target.value) })} />
            </div>
            <div className="form-group sm:col-span-2">
              <label className="label">Description</label>
              <textarea className="input" rows={2} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="label">Stock</label>
              <input type="number" className="input" value={editing.stock ?? 0} onChange={(e) => setEditing({ ...editing, stock: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="label">Image URL</label>
              <input className="input" placeholder="https://…" value={editing.images?.[0] ?? ""} onChange={(e) => setEditing({ ...editing, images: [e.target.value] })} />
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn-primary" onClick={save}>Save</button>
            <button className="btn-ghost" onClick={() => { setEditing(null); setShowForm(false); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className={`card overflow-hidden ${!p.is_active ? "opacity-60" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0]} alt={p.name} className="h-36 w-full object-cover bg-slate-100" loading="lazy" />
            <div className="p-4">
              <p className="font-bold text-ink truncate">{p.name}</p>
              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{p.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-black text-orange-500">{fmtBHD(p.price_fils)}</span>
                <span className="text-xs text-slate-400">Stock: {p.stock}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toggle(p.id)} className="btn-ghost btn-sm flex items-center gap-1">
                  {p.is_active ? <ToggleRight size={13} className="text-emerald-500" /> : <ToggleLeft size={13} />}
                  {p.is_active ? "Active" : "Inactive"}
                </button>
                <button onClick={() => { setEditing(p); setShowForm(true); }} className="btn-ghost btn-sm"><Edit2 size={12} /></button>
                <button onClick={() => del(p.id)} className="btn-ghost btn-sm text-red-500"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
