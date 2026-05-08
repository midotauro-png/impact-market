import Link from "next/link";
import { ShoppingBag, DollarSign, Package, Star, TrendingUp } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { vendors, ordersByVendor, productsByVendor } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

const DEMO_VENDOR_ID = "v-burhan";

export default function VendorOverviewPage() {
  const vendor = vendors.find((v) => v.id === DEMO_VENDOR_ID)!;
  const myOrders = ordersByVendor(DEMO_VENDOR_ID);
  const myProducts = productsByVendor(DEMO_VENDOR_ID);
  const activeOrders = myOrders.filter((o) => !["delivered","cancelled","refunded"].includes(o.status));
  const revenue = myOrders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.vendor_net_fils, 0);

  const recentOrders = [...myOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Vendor info bar */}
      <div className="card p-4 flex items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={vendor.logo_url} alt="" className="h-14 w-14 rounded-xl object-cover bg-slate-100" />
        <div>
          <h2 className="font-black text-ink text-lg">{vendor.business_name}</h2>
          <p className="text-sm text-slate-500">{vendor.address}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={`badge ${vendor.is_open ? "badge-green" : "badge-gray"}`}>{vendor.is_open ? "Open" : "Closed"}</span>
          <StatusBadge status={vendor.status} type="approval" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Net Revenue", value: fmtBHD(revenue), icon: <DollarSign className="text-emerald-500" />, bg: "bg-emerald-50" },
          { label: "Total Orders", value: myOrders.length, icon: <ShoppingBag className="text-blue-500" />, bg: "bg-blue-50" },
          { label: "Active Orders", value: activeOrders.length, icon: <TrendingUp className="text-orange-400" />, bg: "bg-orange-50" },
          { label: "Rating", value: `${vendor.rating} ★`, icon: <Star className="text-amber-400" />, bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.bg}`}>{s.icon}</div>
            <p className="stat-value text-2xl">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-ink">Recent Orders</h3>
          <Link href="/vendor/orders" className="text-xs text-orange-400 font-semibold">View all →</Link>
        </div>
        <div className="table-wrapper rounded-none rounded-b-2xl">
          <table className="data-table">
            <thead><tr><th>Code</th><th>Customer</th><th>Amount</th><th>Status</th><th>Time</th></tr></thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                  <td className="text-sm font-medium text-ink">{o.customer_name}</td>
                  <td className="text-sm font-semibold">{fmtBHD(o.total_fils)}</td>
                  <td><StatusBadge status={o.status} /></td>
                  <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
