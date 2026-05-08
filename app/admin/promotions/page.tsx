"use client";
import { useState } from "react";
import { Megaphone, Crown, Star, Plus, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react";
import { vendors } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";

interface Promotion {
  id: string;
  vendor_id: string;
  title: string;
  discount_pct: number;
  min_order_fils: number;
  is_active: boolean;
  ends_at: string;
}

const DEMO_PROMOS: Promotion[] = [
  { id: "promo-1", vendor_id: "v-burhan",        title: "Eid Special 15% Off",       discount_pct: 15, min_order_fils: 5000, is_active: true,  ends_at: "2026-05-31" },
  { id: "promo-2", vendor_id: "v-teranga",        title: "Friday African Feast 10%",  discount_pct: 10, min_order_fils: 3000, is_active: true,  ends_at: "2026-05-30" },
  { id: "promo-3", vendor_id: "v-muharraq-bakery", title: "Morning Bakery Deal 5%",   discount_pct: 5,  min_order_fils: 2500, is_active: false, ends_at: "2026-05-10" },
];

const BLANK = { vendor_id: "", title: "", discount_pct: 10, min_order_fils: 3000, ends_at: "" };

export default function AdminPromotionsPage() {
  const [promos, setPromos]           = useState<Promotion[]>(DEMO_PROMOS);
  const [featured, setFeatured]       = useState<Set<string>>(new Set(["v-burhan", "v-pearl-cafe"]));
  const [form, setForm]               = useState(BLANK);
  const [showForm, setShowForm]       = useState(false);

  function addPromo() {
    if (!form.vendor_id || !form.title || !form.ends_at) return;
    setPromos((prev) => [...prev, { ...form, id: `promo-${Date.now()}`, is_active: true }]);
    setForm(BLANK);
    setShowForm(false);
  }

  function togglePromo(id: string) {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  function removePromo(id: string) {
    setPromos((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleFeatured(id: string) {
    setFeatured((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const approvedVendors = vendors.filter((v) => v.status === "approved");

  return (
    <div className="space-y-7">
      <h2 className="text-xl font-black text-ink flex items-center gap-2">
        <Megaphone size={20} className="text-orange-500" /> Promotions & Featured Sellers
      </h2>

      {/* ── Promotions ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-ink">Active Promotions</h3>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary btn-sm">
            <Plus size={13} /> New Promotion
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div className="card p-5 space-y-4 border-2 border-orange-200">
            <p className="font-bold text-ink text-sm">Create Promotion</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="form-group">
                <label className="label">Seller</label>
                <select
                  className="input"
                  value={form.vendor_id}
                  onChange={(e) => setForm({ ...form, vendor_id: e.target.value })}
                >
                  <option value="">Select seller…</option>
                  {approvedVendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.business_name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Promotion Title</label>
                <input
                  className="input"
                  placeholder="e.g. Weekend 10% Off"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label">Discount %</label>
                <input
                  type="number" min={1} max={50}
                  className="input"
                  value={form.discount_pct}
                  onChange={(e) => setForm({ ...form, discount_pct: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="label">Min Order (fils)</label>
                <input
                  type="number"
                  className="input"
                  value={form.min_order_fils}
                  onChange={(e) => setForm({ ...form, min_order_fils: Number(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="label">Ends On</label>
                <input
                  type="date"
                  className="input"
                  value={form.ends_at}
                  onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={addPromo} className="btn-primary flex-1">Create</button>
            </div>
          </div>
        )}

        {/* Promos list */}
        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr><th>Seller</th><th>Title</th><th>Discount</th><th>Min Order</th><th>Ends</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {promos.map((p) => {
                  const vendor = vendors.find((v) => v.id === p.vendor_id);
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={vendor?.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover bg-slate-100" />
                          <span className="text-sm font-semibold text-ink">{vendor?.business_name}</span>
                        </div>
                      </td>
                      <td>
                        <span className="flex items-center gap-1.5 text-sm">
                          <Tag size={12} className="text-orange-400" /> {p.title}
                        </span>
                      </td>
                      <td><span className="badge-orange">{p.discount_pct}% off</span></td>
                      <td className="text-sm text-slate-500">{fmtBHD(p.min_order_fils)}+</td>
                      <td className="text-xs text-slate-400">{p.ends_at}</td>
                      <td>
                        <button
                          onClick={() => togglePromo(p.id)}
                          className={`flex items-center gap-1 text-xs font-semibold ${p.is_active ? "text-emerald-600" : "text-slate-400"}`}
                        >
                          {p.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                          {p.is_active ? "Active" : "Paused"}
                        </button>
                      </td>
                      <td>
                        <button onClick={() => removePromo(p.id)} className="text-slate-400 hover:text-red-500 transition">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Featured Sellers ────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-amber-500" />
          <h3 className="font-bold text-ink">Featured Sellers</h3>
          <span className="text-xs text-slate-500 ml-1">({featured.size} featured — shown first in customer browse)</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedVendors.map((v) => {
            const isFeatured = featured.has(v.id);
            return (
              <div
                key={v.id}
                className={`card p-4 flex items-center gap-3 transition ${isFeatured ? "border-2 border-amber-300 bg-amber-50/40" : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink text-sm truncate">{v.business_name}</p>
                  <p className="text-xs text-slate-500">{v.rating} ★ · {v.total_orders} orders</p>
                  <p className="text-xs text-slate-400 capitalize">{v.subscription_plan} plan</p>
                </div>
                <button
                  onClick={() => toggleFeatured(v.id)}
                  className={`shrink-0 transition ${isFeatured ? "text-amber-500" : "text-slate-300 hover:text-amber-400"}`}
                  title={isFeatured ? "Remove featured" : "Mark as featured"}
                >
                  <Star size={20} className={isFeatured ? "fill-amber-400" : ""} />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
