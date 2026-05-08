import StatusBadge from "@/components/ui/status-badge";
import { ordersByDriver, vendorById } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

const DEMO_DRIVER_ID = "d-1";

export default function DriverHistoryPage() {
  const orders = ordersByDriver(DEMO_DRIVER_ID);

  return (
    <div className="space-y-5 max-w-3xl">
      <h2 className="text-xl font-black text-ink">Delivery History</h2>
      {orders.length === 0 ? (
        <div className="card p-10 text-center text-slate-400">No deliveries yet.</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr>
              <th>Order</th><th>Vendor</th><th>Customer</th>
              <th>Distance Zone</th><th>Payout</th><th>Status</th><th>Time</th>
            </tr></thead>
            <tbody>
              {[...orders]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((o) => {
                  const vendor = vendorById(o.vendor_id);
                  return (
                    <tr key={o.id}>
                      <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                      <td className="text-xs font-semibold">{vendor?.business_name}</td>
                      <td className="text-xs text-slate-600">{o.customer_name}</td>
                      <td className="text-xs text-slate-500">{o.vendor_zone_id} → {o.customer_zone_id}</td>
                      <td className="font-bold text-emerald-600 text-sm">{fmtBHD(o.driver_payout_fils)}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
