import Link from "next/link";
import { TrendingUp, ShoppingBag, Users, Truck, BadgeDollarSign, Clock } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { orders, vendors, drivers } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

export default function AdminOverviewPage() {
  const approvedVendors = vendors.filter((v) => v.status === "approved").length;
  const pendingVendors  = vendors.filter((v) => v.status === "pending").length;
  const onlineDrivers   = drivers.filter((d) => d.is_online && d.status === "approved").length;
  const totalDrivers    = drivers.filter((d) => d.status === "approved").length;

  const gmv             = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.total_fils, 0);
  const totalCommission = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.commission_fils, 0);
  const adminProfit     = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.admin_profit_fils, 0);

  const recentOrders = [...orders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);
  const pendingApprovals = vendors.filter((v) => v.status === "pending");

  const stats = [
    { label: "Gross Merchandise Value", value: fmtBHD(gmv),     icon: <TrendingUp className="text-orange-400" />, color: "bg-orange-50" },
    { label: "Admin Profit",    value: fmtBHD(adminProfit),     icon: <BadgeDollarSign className="text-emerald-500" />, color: "bg-emerald-50" },
    { label: "Total Orders",    value: orders.length,            icon: <ShoppingBag className="text-blue-500" />,    color: "bg-blue-50" },
    { label: "Active Vendors",  value: `${approvedVendors}`,    icon: <Users className="text-purple-500" />,        color: "bg-purple-50" },
    { label: "Drivers Online",  value: `${onlineDrivers}/${totalDrivers}`, icon: <Truck className="text-sky-500" />, color: "bg-sky-50" },
    { label: "Commission Earned", value: fmtBHD(totalCommission), icon: <BadgeDollarSign className="text-amber-500" />, color: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              {s.icon}
            </div>
            <p className="stat-value text-2xl">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-ink">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-orange-400 font-semibold">View all →</Link>
          </div>
          <div className="table-wrapper rounded-none rounded-b-2xl">
            <table className="data-table">
              <thead><tr>
                <th>Code</th><th>Customer</th><th>Total</th><th>Status</th><th>Time</th>
              </tr></thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/orders/${o.short_code}`} className="font-mono text-orange-500 hover:underline text-xs">{o.short_code}</Link></td>
                    <td className="font-medium text-ink">{o.customer_name}</td>
                    <td className="font-semibold">{fmtBHD(o.total_fils)}</td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="text-slate-400 flex items-center gap-1"><Clock size={10} />{relTime(o.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending approvals */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-ink">Pending Approvals</h2>
            <span className="badge-amber">{pendingApprovals.length}</span>
          </div>
          {pendingApprovals.length === 0 ? (
            <p className="p-5 text-slate-400 text-sm">All caught up 🎉</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingApprovals.map((v) => (
                <div key={v.id} className="flex items-center gap-3 px-5 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.logo_url} alt="" className="h-9 w-9 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink truncate">{v.business_name}</p>
                    <p className="text-xs text-slate-400">{v.address}</p>
                  </div>
                  <Link href="/admin/vendors" className="btn-primary btn-sm">Review</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
