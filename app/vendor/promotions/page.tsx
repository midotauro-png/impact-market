"use client";
import { useState } from "react";
import { Tag, Plus, Trash2, ToggleLeft, ToggleRight, Info } from "lucide-react";
import { fmtBHD } from "@/lib/utils";
import { DEFAULT_SETTINGS } from "@/lib/profit-calc";

interface PromoForm {
  title: string;
  discount_pct: number;
  min_order_fils: number;
  starts_at: string;
  ends_at: string;
  description: string;
}

interface Promo extends PromoForm {
  id: string;
  is_active: boolean;
  redemptions: number;
}

const today = new Date().toISOString().slice(0, 10);
const nextWeek = new Date(Date.now() + 7 * 86400_000).toISOString().slice(0, 10);

const DEMO_PROMOS: Promo[] = [
  {
    id: "p-1", title: "Weekend Special", discount_pct: 10,
    min_order_fils: 5000, starts_at: today, ends_at: nextWeek,
    description: "10% off all orders over 5 BHD this weekend.",
    is_active: true, redemptions: 14,
  },
];

const BLANK: PromoForm = {
  title: "", discount_pct: 10, min_order_fils: DEFAULT_SETTINGS.min_order_fils,
  starts_at: today, ends_at: nextWeek, description: "",
};

export default function VendorPromotionsPage() {
  const [promos, setPromos]   = useState<Promo[]>(DEMO_PROMOS);
  const [form, setForm]       = useState<PromoForm>(BLANK);
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors]   = useState<Partial<Record<keyof PromoForm, string>>>({});

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim())         e.title = "Title is required";
    if (form.discount_pct < 1 || form.discount_pct > 50) e.discount_pct = "Must be 1–50%";
    if (form.min_order_fils < DEFAULT_SETTINGS.min_order_fils) e.min_order_fils = `Min ${fmtBHD(DEFAULT_SETTINGS.min_order_fils)}`;
    if (!form.ends_at || form.ends_at < today) e.ends_at = "End date must be in the future";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function addPromo() {
    if (!validate()) return;
    setPromos((prev) => [...prev, { ...form, id: `p-${Date.now()}`, is_active: true, redemptions: 0 }]);
    setForm(BLANK);
    setShowForm(false);
    setErrors({});
  }

  function toggle(id: string) {
    setPromos((prev) => prev.map((p) => p.id === id ? { ...p, is_active: !p.is_active } : p));
  }

  function remove(id: string) {
    setPromos((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-ink">Promotions & Discounts</h2>
          <p className="text-sm text-slate-500 mt-0.5">Create campaigns to boost sales and attract customers.</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setErrors({}); }} className="btn-primary btn-sm">
          <Plus size={13} /> New Campaign
        </button>
      </div>

      {/* Info */}
      <div className="card p-4 flex items-start gap-3 bg-blue-50 border border-blue-200">
        <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700">
          Discounts are deducted from your payout, not from Impact Market&apos;s commission.
          Commission is calculated on the original subtotal price.
        </p>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card p-5 space-y-4 border-2 border-orange-200">
          <p className="font-bold text-ink">New Promotion</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="form-group sm:col-span-2">
              <label className="label">Campaign Title *</label>
              <input
                className={`input ${errors.title ? "border-red-400" : ""}`}
                placeholder="e.g. Weekend Feast 10% Off"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label className="label">Discount % *</label>
              <div className="relative">
                <input
                  type="number" min={1} max={50}
                  className={`input pr-8 ${errors.discount_pct ? "border-red-400" : ""}`}
                  value={form.discount_pct}
                  onChange={(e) => setForm({ ...form, discount_pct: Number(e.target.value) })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
              </div>
              {errors.discount_pct && <p className="text-xs text-red-500 mt-1">{errors.discount_pct}</p>}
            </div>

            <div className="form-group">
              <label className="label">Minimum Order (fils)</label>
              <input
                type="number"
                className={`input ${errors.min_order_fils ? "border-red-400" : ""}`}
                value={form.min_order_fils}
                onChange={(e) => setForm({ ...form, min_order_fils: Number(e.target.value) })}
              />
              <p className="text-xs text-slate-400 mt-1">= {fmtBHD(form.min_order_fils)}</p>
              {errors.min_order_fils && <p className="text-xs text-red-500">{errors.min_order_fils}</p>}
            </div>

            <div className="form-group">
              <label className="label">Start Date</label>
              <input
                type="date"
                className="input"
                value={form.starts_at}
                min={today}
                onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="label">End Date *</label>
              <input
                type="date"
                className={`input ${errors.ends_at ? "border-red-400" : ""}`}
                value={form.ends_at}
                min={today}
                onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
              />
              {errors.ends_at && <p className="text-xs text-red-500 mt-1">{errors.ends_at}</p>}
            </div>

            <div className="form-group sm:col-span-2">
              <label className="label">Description (optional)</label>
              <textarea
                className="input resize-none"
                rows={2}
                placeholder="Describe the promotion to customers…"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setShowForm(false); setErrors({}); }} className="btn-ghost flex-1">Cancel</button>
            <button onClick={addPromo} className="btn-primary flex-1">Create Campaign</button>
          </div>
        </div>
      )}

      {/* Promotions list */}
      {promos.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <Tag size={36} className="text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-400">No promotions yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary btn-sm">Create your first campaign</button>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => (
            <div key={p.id} className={`card p-4 border-l-4 ${p.is_active ? "border-l-emerald-400" : "border-l-slate-200"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-ink">{p.title}</p>
                    <span className="badge-orange">{p.discount_pct}% off</span>
                    {p.is_active
                      ? <span className="badge-green text-[10px]">Active</span>
                      : <span className="badge text-[10px] bg-slate-100 text-slate-500">Paused</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Min order: {fmtBHD(p.min_order_fils)} · {p.starts_at} → {p.ends_at}
                  </p>
                  {p.description && <p className="text-xs text-slate-400 mt-1 truncate">{p.description}</p>}
                  <p className="text-xs font-semibold text-orange-500 mt-1.5">{p.redemptions} redemptions</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggle(p.id)}
                    className={`transition ${p.is_active ? "text-emerald-500" : "text-slate-400"}`}
                  >
                    {p.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                  <button onClick={() => remove(p.id)} className="text-slate-400 hover:text-red-500 transition">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
