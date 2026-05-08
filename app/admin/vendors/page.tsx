"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { vendors as initialVendors, categories } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";
import type { Vendor } from "@/lib/types";

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState("");

  const filtered = vendors.filter((v) =>
    v.business_name.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  function setStatus(id: string, status: Vendor["status"]) {
    setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status } : v));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-ink">Vendors ({vendors.length})</h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input pl-9 py-2 w-60 text-xs"
            placeholder="Search vendors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((v) => {
          const cat = categories.find((c) => c.id === v.category_id);
          return (
            <div key={v.id} className="card p-4 space-y-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div className="min-w-0">
                  <p className="font-bold text-ink truncate">{v.business_name}</p>
                  <p className="text-xs text-slate-400 truncate">{v.owner_name} · {cat?.name}</p>
                </div>
                <StatusBadge status={v.status} type="approval" className="shrink-0" />
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>{v.email}</p>
                <p>{v.phone} {v.cr_number ? `· CR: ${v.cr_number}` : ""}</p>
                <p>{v.address}</p>
                <p>Commission: <span className="font-semibold text-orange-500">{v.commission_pct}%</span> · {v.total_orders} orders</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {v.status !== "approved" && (
                  <button onClick={() => setStatus(v.id, "approved")} className="btn-primary btn-sm">Approve</button>
                )}
                {v.status !== "suspended" && (
                  <button onClick={() => setStatus(v.id, "suspended")} className="btn-ghost btn-sm text-red-500">Suspend</button>
                )}
                {v.status !== "rejected" && v.status !== "approved" && (
                  <button onClick={() => setStatus(v.id, "rejected")} className="btn-danger btn-sm">Reject</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
