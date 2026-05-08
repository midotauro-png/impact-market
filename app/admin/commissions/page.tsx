"use client";
import { useState } from "react";
import { BadgeDollarSign, Save } from "lucide-react";
import { categories as initialCategories } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";
import { orders } from "@/lib/mock-data";

export default function AdminCommissionsPage() {
  const [cats, setCats] = useState(initialCategories);

  function updatePct(id: string, pct: number) {
    setCats((prev) => prev.map((c) => c.id === id ? { ...c, commission_pct: pct } : c));
  }

  // Earnings per category
  const earnings = cats.map((cat) => {
    const catOrders = orders.filter((o) =>
      o.payment_status === "paid" /* match by vendor category in real app */
    );
    return { cat, total: catOrders.reduce((s, o) => s + o.commission_fils, 0) / cats.length };
  });

  const totalCommission = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.commission_fils, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink flex items-center gap-2">
          <BadgeDollarSign className="text-emerald-500" size={22} /> Commission Settings
        </h2>
        <button className="btn-primary"><Save size={14} /> Save Changes</button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Commission (All Time)", value: fmtBHD(totalCommission), color: "text-emerald-600" },
          { label: "Total Orders Paid", value: orders.filter((o) => o.payment_status === "paid").length, color: "text-ink" },
          { label: "Average Commission Rate", value: `${(cats.reduce((s, c) => s + c.commission_pct, 0) / cats.length).toFixed(1)}%`, color: "text-orange-500" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <p className={`stat-value ${s.color}`}>{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Per-category commission editor */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink">
          Commission Rates by Category
        </div>
        <div className="divide-y divide-slate-100">
          {cats.map((cat) => (
            <div key={cat.id} className="flex items-center gap-4 px-5 py-4">
              <span className="text-2xl w-8 text-center shrink-0">{cat.icon}</span>
              <p className="flex-1 font-semibold text-ink text-sm">{cat.name}</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={35}
                  value={cat.commission_pct}
                  onChange={(e) => updatePct(cat.id, Number(e.target.value))}
                  className="input w-20 text-center text-sm py-1.5"
                />
                <span className="text-slate-400 text-sm">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
