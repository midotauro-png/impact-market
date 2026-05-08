"use client";
import { useState } from "react";
import { DollarSign, CheckCircle } from "lucide-react";
import { vendors, drivers, orders } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";

export default function AdminPayoutsPage() {
  const [paid, setPaid] = useState<Set<string>>(new Set());

  // Build payout rows for vendors
  const vendorPayouts = vendors
    .filter((v) => v.status === "approved")
    .map((v) => {
      const vOrders = orders.filter((o) => o.vendor_id === v.id && o.payment_status === "paid");
      const net = vOrders.reduce((s, o) => s + o.vendor_net_fils, 0);
      return { id: `v-${v.id}`, name: v.business_name, type: "vendor" as const, amount: net, count: vOrders.length };
    })
    .filter((r) => r.amount > 0);

  const driverPayouts = drivers
    .filter((d) => d.status === "approved")
    .map((d) => {
      const dOrders = orders.filter((o) => o.driver_id === d.id && o.status === "delivered");
      const amount = dOrders.reduce((s, o) => s + o.driver_payout_fils, 0);
      return { id: `d-${d.id}`, name: d.full_name, type: "driver" as const, amount, count: dOrders.length };
    })
    .filter((r) => r.amount > 0);

  const all = [...vendorPayouts, ...driverPayouts];
  const totalPending = all.filter((r) => !paid.has(r.id)).reduce((s, r) => s + r.amount, 0);

  function payAll() {
    setPaid(new Set(all.map((r) => r.id)));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-black text-ink">Payouts</h2>
          <p className="text-sm text-slate-500 mt-0.5">Total pending: <span className="font-bold text-orange-500">{fmtBHD(totalPending)}</span></p>
        </div>
        <button className="btn-primary" onClick={payAll}>
          <DollarSign size={14} /> Pay All Pending
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>Recipient</th><th>Type</th><th>Orders</th>
            <th>Amount Due</th><th>Status</th><th>Action</th>
          </tr></thead>
          <tbody>
            {all.map((row) => {
              const isPaid = paid.has(row.id);
              return (
                <tr key={row.id}>
                  <td className="font-semibold text-ink text-sm">{row.name}</td>
                  <td>
                    <span className={`badge text-[10px] ${row.type === "vendor" ? "badge-navy" : "badge-purple"}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="text-sm">{row.count}</td>
                  <td className="font-bold text-sm text-emerald-600">{fmtBHD(row.amount)}</td>
                  <td>
                    {isPaid ? (
                      <span className="badge-green flex items-center gap-1 w-fit">
                        <CheckCircle size={10} /> Paid
                      </span>
                    ) : (
                      <span className="badge-amber">Pending</span>
                    )}
                  </td>
                  <td>
                    {!isPaid && (
                      <button
                        onClick={() => setPaid((prev) => new Set([...prev, row.id]))}
                        className="btn-primary btn-sm"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
