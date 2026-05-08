import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { drivers, ordersByDriver } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

const DEMO_DRIVER_ID = "d-1";

export default function DriverEarningsPage() {
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID)!;
  const orders = ordersByDriver(DEMO_DRIVER_ID).filter((o) => o.status === "delivered");

  const totalEarned  = orders.reduce((s, o) => s + o.driver_payout_fils, 0);
  const available    = driver.wallet_fils;
  const pending      = Math.max(0, totalEarned - available);

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-black text-ink">Earnings</h2>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Earned", value: fmtBHD(totalEarned), icon: <DollarSign className="text-emerald-500" />, bg: "bg-emerald-50" },
          { label: "Available Now", value: fmtBHD(available), icon: <TrendingUp className="text-blue-500" />, bg: "bg-blue-50" },
          { label: "Pending", value: fmtBHD(pending), icon: <Clock className="text-amber-500" />, bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${s.bg}`}>{s.icon}</div>
            <p className="stat-value text-xl">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-bold text-ink">Withdraw Earnings</p>
          <p className="text-sm text-slate-500 mt-0.5">Available: <span className="font-bold text-emerald-600">{fmtBHD(available)}</span></p>
        </div>
        <button className="btn-primary">Withdraw to Wallet</button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">Delivery History</div>
        {orders.length === 0 ? (
          <p className="p-6 text-slate-400 text-sm text-center">No completed deliveries yet.</p>
        ) : (
          <div className="table-wrapper rounded-none rounded-b-2xl">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Time</th><th>Payout</th></tr></thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                    <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                    <td className="font-bold text-emerald-600">{fmtBHD(o.driver_payout_fils)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
