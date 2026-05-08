"use client";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { categories as init } from "@/lib/mock-data";

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(init);
  const [form, setForm] = useState({ name: "", icon: "🛍️", commission_pct: 15 });

  function add() {
    if (!form.name) return;
    setCats((prev) => [...prev, {
      id: `cat-${Date.now()}`, slug: form.name.toLowerCase().replace(/\s+/g, "-"),
      name: form.name, icon: form.icon, commission_pct: form.commission_pct,
    }]);
    setForm({ name: "", icon: "🛍️", commission_pct: 15 });
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <h2 className="text-xl font-black text-ink">Categories</h2>

      {/* Add form */}
      <div className="card p-4 flex gap-3 items-end flex-wrap">
        <div className="form-group w-16">
          <label className="label">Icon</label>
          <input className="input text-center text-xl" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        </div>
        <div className="form-group flex-1 min-w-40">
          <label className="label">Category Name</label>
          <input className="input" placeholder="e.g. Sweets" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-group w-28">
          <label className="label">Commission %</label>
          <input type="number" className="input" value={form.commission_pct} onChange={(e) => setForm({ ...form, commission_pct: Number(e.target.value) })} />
        </div>
        <button onClick={add} className="btn-primary mb-0.5"><Plus size={14} /> Add</button>
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        <div className="divide-y divide-slate-100">
          {cats.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-5 py-3">
              <span className="text-2xl w-8 text-center">{c.icon}</span>
              <p className="flex-1 font-semibold text-ink">{c.name}</p>
              <span className="text-xs text-slate-400 font-mono">{c.slug}</span>
              <span className="badge-orange">{c.commission_pct}%</span>
              <button onClick={() => setCats((prev) => prev.filter((x) => x.id !== c.id))} className="text-slate-400 hover:text-red-500 transition">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
