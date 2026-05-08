"use client";
import { useState } from "react";
import StatusBadge from "@/components/ui/status-badge";
import { ordersByVendor } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const DEMO_VENDOR_ID = "v-burhan";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  paid: "vendor_accepted",
  vendor_accepted: "vendor_preparing",
  vendor_preparing: "driver_assigned",
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState(ordersByVendor(DEMO_VENDOR_ID));

  function advance(id: string, current: OrderStatus) {
    const next = NEXT_STATUS[current];
    if (!next) return;
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next } : o));
  }

  const active = orders.filter((o) => !["delivered","cancelled","refunded","pending_payment"].includes(o.status));
  const history = orders.filter((o) => ["delivered","cancelled","refunded"].includes(o.status));

  function OrderTable({ list }: { list: typeof orders }) {
    return (
      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>Code</th><th>Customer</th><th>Items</th><th>Total</th>
            <th>Net (after commission)</th><th>Status</th><th>Time</th><th>Action</th>
          </tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                <td>
                  <p className="font-semibold text-ink text-sm">{o.customer_name}</p>
                  <p className="text-xs text-slate-400">{o.delivery_address}</p>
                </td>
                <td className="text-xs text-slate-600">{o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}</td>
                <td className="font-semibold text-sm">{fmtBHD(o.total_fils)}</td>
                <td className="font-semibold text-sm text-emerald-600">{fmtBHD(o.vendor_net_fils)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                <td>
                  {NEXT_STATUS[o.status] && (
                    <button onClick={() => advance(o.id, o.status)} className="btn-primary btn-sm">
                      → {NEXT_STATUS[o.status]?.replace(/_/g, " ")}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-ink">Orders</h2>

      <div>
        <h3 className="font-bold text-ink mb-3 flex items-center gap-2">
          Active <span className="badge-orange">{active.length}</span>
        </h3>
        {active.length === 0
          ? <div className="card p-8 text-center text-slate-400">No active orders right now 🎉</div>
          : <OrderTable list={active} />}
      </div>

      <div>
        <h3 className="font-bold text-ink mb-3">History</h3>
        {history.length === 0
          ? <div className="card p-6 text-center text-slate-400 text-sm">No completed orders yet.</div>
          : <OrderTable list={history} />}
      </div>
    </div>
  );
}
