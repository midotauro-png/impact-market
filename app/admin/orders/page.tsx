"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, Download } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { orders as allOrders, vendorById } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");

  const orders = [...allOrders]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .filter((o) =>
      !search ||
      o.short_code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search)
    );

  function exportCSV() {
    const rows = [
      ["Code","Customer","Phone","Vendor","Total","Payment","Status","Date"],
      ...orders.map((o) => [
        o.short_code, o.customer_name, o.customer_phone,
        vendorById(o.vendor_id)?.business_name ?? "",
        (o.total_fils / 1000).toFixed(3),
        o.payment_method, o.status, o.created_at,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `orders-${Date.now()}.csv`;
    a.click();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-ink">All Orders ({orders.length})</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9 py-2 w-56 text-xs"
              placeholder="Search code or customer…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button onClick={exportCSV} className="btn-ghost btn-sm"><Download size={13} /> Export</button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead><tr>
            <th>Code</th>
            <th>Customer</th>
            <th>Vendor</th>
            <th>Subtotal</th>
            <th>Delivery</th>
            <th>Commission</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Time</th>
            <th></th>
          </tr></thead>
          <tbody>
            {orders.map((o) => {
                const vendor = vendorById(o.vendor_id);
                return (
                  <tr key={o.id}>
                    <td><span className="font-mono text-xs text-orange-500">{o.short_code}</span></td>
                    <td>
                      <p className="font-semibold text-ink text-xs">{o.customer_name}</p>
                      <p className="text-slate-400 text-xs">{o.customer_phone}</p>
                    </td>
                    <td className="text-xs text-slate-600">{vendor?.business_name}</td>
                    <td className="text-xs font-semibold">{fmtBHD(o.subtotal_fils)}</td>
                    <td className="text-xs">{fmtBHD(o.delivery_fee_fils)}</td>
                    <td className="text-xs font-semibold text-emerald-600">{fmtBHD(o.commission_fils)}</td>
                    <td className="text-xs font-black text-ink">{fmtBHD(o.total_fils)}</td>
                    <td>
                      <span className={`badge text-[10px] ${o.payment_status === "paid" ? "badge-green" : "badge-amber"}`}>
                        {o.payment_method === "cash_on_delivery" ? "COD" : "Online"} · {o.payment_status}
                      </span>
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                    <td>
                      <Link href={`/admin/orders/${o.short_code}`} className="btn-ghost btn-sm text-xs">View</Link>
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
