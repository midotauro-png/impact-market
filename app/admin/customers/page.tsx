"use client";
import { useState } from "react";
import { Search, Users, ShoppingBag, DollarSign, MapPin } from "lucide-react";
import { orders } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import StatusBadge from "@/components/ui/status-badge";

// Derive unique customers from order data
function buildCustomers() {
  const map = new Map<string, {
    id: string; name: string; phone: string;
    zone_id: string; total_orders: number;
    total_spent_fils: number; last_order_at: string;
  }>();

  for (const o of orders) {
    const existing = map.get(o.customer_id);
    if (!existing) {
      map.set(o.customer_id, {
        id: o.customer_id, name: o.customer_name, phone: o.customer_phone,
        zone_id: o.customer_zone_id, total_orders: 1,
        total_spent_fils: o.total_fils, last_order_at: o.created_at,
      });
    } else {
      existing.total_orders += 1;
      existing.total_spent_fils += o.total_fils;
      if (o.created_at > existing.last_order_at) existing.last_order_at = o.created_at;
    }
  }
  return [...map.values()].sort((a, b) => b.total_orders - a.total_orders);
}

const CUSTOMERS = buildCustomers();

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = CUSTOMERS.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const totalSpend     = CUSTOMERS.reduce((s, c) => s + c.total_spent_fils, 0);
  const totalOrdersAll = CUSTOMERS.reduce((s, c) => s + c.total_orders, 0);
  const selectedCustomer = CUSTOMERS.find((c) => c.id === selected);
  const selectedOrders   = selectedCustomer ? orders.filter((o) => o.customer_id === selectedCustomer.id) : [];

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-black text-ink">Customers</h2>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Customers", value: CUSTOMERS.length, icon: <Users size={18} className="text-blue-500" />, bg: "bg-blue-50" },
          { label: "Total Orders",    value: totalOrdersAll,  icon: <ShoppingBag size={18} className="text-orange-500" />, bg: "bg-orange-50" },
          { label: "Total GMV",       value: fmtBHD(totalSpend), icon: <DollarSign size={18} className="text-emerald-500" />, bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
            <div>
              <p className="stat-value text-xl">{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-5">
        {/* Customer list */}
        <div className="xl:col-span-2 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9 py-2 w-full text-sm"
              placeholder="Search by name or phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="card overflow-hidden">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Zone</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Last Order</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      className={selected === c.id ? "bg-orange-50" : ""}
                    >
                      <td>
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-black shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-ink text-sm">{c.name}</p>
                            <p className="text-xs text-slate-400">{c.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <MapPin size={10} className="text-orange-400" />
                          {c.zone_id.replace("z-", "").replace(/-/g, " ")}
                        </span>
                      </td>
                      <td className="font-bold text-sm">{c.total_orders}</td>
                      <td className="font-bold text-emerald-600 text-sm">{fmtBHD(c.total_spent_fils)}</td>
                      <td className="text-xs text-slate-400">{relTime(c.last_order_at)}</td>
                      <td>
                        <button
                          onClick={() => setSelected(selected === c.id ? null : c.id)}
                          className="btn-ghost btn-sm text-xs"
                        >
                          {selected === c.id ? "Close" : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Customer detail panel */}
        <div>
          {selectedCustomer ? (
            <div className="card p-5 space-y-4 sticky top-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-lg font-black shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-ink">{selectedCustomer.name}</p>
                  <p className="text-xs text-slate-500">{selectedCustomer.phone}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xl font-black text-ink">{selectedCustomer.total_orders}</p>
                  <p className="text-xs text-slate-400">Orders</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-lg font-black text-emerald-600">{fmtBHD(selectedCustomer.total_spent_fils)}</p>
                  <p className="text-xs text-slate-400">Spent</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order History</p>
                <div className="space-y-2">
                  {selectedOrders.map((o) => (
                    <div key={o.id} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-orange-500">{o.short_code}</span>
                      <StatusBadge status={o.status} />
                      <span className="font-bold">{fmtBHD(o.total_fils)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-10 text-center text-slate-400 space-y-2">
              <Users size={32} className="mx-auto text-slate-300" />
              <p className="text-sm">Select a customer to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
