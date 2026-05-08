import { DollarSign, TrendingUp, Clock, Download } from "lucide-react";
import { ordersByVendor } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

const DEMO_VENDOR_ID = "v-burhan";

export default function VendorEarningsPage() {
  const orders = ordersByVendor(DEMO_VENDOR_ID);
  const paidOrders = orders.filter((o) => o.payment_status === "paid");

  const totalRevenue   = paidOrders.reduce((s, o) => s + o.subtotal_fils, 0);
  const totalCommission = paidOrders.reduce((s, o) => s + o.commission_fils, 0);
  const netEarnings    = paidOrders.reduce((s, o) => s + o.vendor_net_fils, 0);
  const pendingPayout  = Math.round(netEarnings * 0.3); // demo: 30% pending
  const available      = netEarnings - pendingPayout;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink">Earnings</h2>
        <button className="btn-ghost btn-sm"><Download size={13} /> Export</button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Net Earned", value: fmtBHD(netEarnings), color: "text-ink", bg: "bg-emerald-50", icon: <DollarSign className="text-emerald-500" /> },
          { label: "Available", value: fmtBHD(available), color: "text-emerald-600", bg: "bg-emerald-50", icon: <TrendingUp className="text-emerald-500" /> },
          { label: "Pending Payout", value: fmtBHD(pendingPayout), color: "text-amber-600", bg: "bg-amber-50", icon: <Clock className="text-amber-500" /> },
          { label: "Platform Commission", value: fmtBHD(totalCommission), color: "text-orange-500", bg: "bg-orange-50", icon: <DollarSign className="text-orange-400" /> },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>{s.icon}</div>
            <p className={`stat-value text-xl ${s.color}`}>{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Withdraw */}
      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-bold text-ink">Request Payout</p>
          <p className="text-sm text-slate-500 mt-0.5">Available balance: <span className="font-bold text-emerald-600">{fmtBHD(available)}</span></p>
        </div>
        <button className="btn-primary">Withdraw to Bank</button>
      </div>

      {/* Order breakdown */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">
          Order Earnings Breakdown
        </div>
        <div className="table-wrapper rounded-none rounded-b-2xl">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Date</th>
                <th>Subtotal</th>
                <th>Commission</th>
                <th>Your Net</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...orders]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                    <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                    <td className="text-sm">{fmtBHD(o.subtotal_fils)}</td>
                    <td className="text-sm text-red-500">-{fmtBHD(o.commission_fils)}</td>
                    <td className="text-sm font-bold text-emerald-600">{fmtBHD(o.vendor_net_fils)}</td>
                    <td>
                      <span className={`badge text-[10px] ${o.payment_status === "paid" ? "badge-green" : "badge-amber"}`}>
                        {o.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
