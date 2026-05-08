import { BarChart3, TrendingUp, Users, Truck } from "lucide-react";
import { orders, vendors, drivers } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";
import { zoneById, ZONES } from "@/lib/zones";

export default function AdminReportsPage() {
  const paidOrders   = orders.filter((o) => o.payment_status === "paid");
  const gmv          = paidOrders.reduce((s, o) => s + o.total_fils, 0);
  const commission   = paidOrders.reduce((s, o) => s + o.commission_fils, 0);
  const driverPayouts = paidOrders.reduce((s, o) => s + o.driver_payout_fils, 0);
  const adminProfit  = paidOrders.reduce((s, o) => s + o.admin_profit_fils, 0);
  const serviceFees  = paidOrders.reduce((s, o) => s + o.service_fee_fils, 0);

  // Orders per zone
  const zoneBreakdown = ZONES.map((z) => ({
    zone: z,
    count: orders.filter((o) => o.customer_zone_id === z.id || o.vendor_zone_id === z.id).length,
    revenue: orders.filter((o) => o.customer_zone_id === z.id).reduce((s, o) => s + o.total_fils, 0),
  })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count);

  // Top vendors
  const vendorStats = vendors.map((v) => ({
    vendor: v,
    orders: orders.filter((o) => o.vendor_id === v.id).length,
    revenue: orders.filter((o) => o.vendor_id === v.id && o.payment_status === "paid").reduce((s, o) => s + o.subtotal_fils, 0),
  })).sort((a, b) => b.orders - a.orders);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-ink flex items-center gap-2">
        <BarChart3 className="text-navy-600" size={22} /> Platform Reports
      </h2>

      {/* P&L Summary */}
      <div className="card p-5">
        <h3 className="font-bold text-ink mb-4">Profit & Loss Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Gross Merchandise Value", value: gmv, color: "text-ink" },
            { label: "Platform Commission", value: commission, color: "text-emerald-600" },
            { label: "Service Fees", value: serviceFees, color: "text-blue-600" },
            { label: "Driver Payouts", value: driverPayouts, color: "text-purple-600" },
            { label: "Admin Net Profit", value: adminProfit, color: "text-orange-500" },
          ].map((r) => (
            <div key={r.label} className="text-center">
              <p className={`text-2xl font-black ${r.color}`}>{fmtBHD(r.value)}</p>
              <p className="text-xs text-slate-400 mt-1">{r.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Zone breakdown */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">Orders by Zone</div>
          <div className="divide-y divide-slate-100">
            {zoneBreakdown.map(({ zone, count, revenue }) => (
              <div key={zone.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1">
                  <p className="font-semibold text-ink text-sm">{zone.name}</p>
                  <p className="text-xs text-slate-400">{zone.cities.slice(0, 2).join(", ")}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink text-sm">{count} orders</p>
                  <p className="text-xs text-emerald-600">{fmtBHD(revenue)}</p>
                </div>
                {/* Mini bar */}
                <div className="w-16 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${Math.min(100, (count / orders.length) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top vendors */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">Top Vendors</div>
          <div className="divide-y divide-slate-100">
            {vendorStats.map(({ vendor, orders: cnt, revenue }) => (
              <div key={vendor.id} className="flex items-center gap-3 px-5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={vendor.logo_url} alt="" className="h-9 w-9 rounded-lg object-cover bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{vendor.business_name}</p>
                  <p className="text-xs text-slate-400">{cnt} orders</p>
                </div>
                <p className="text-sm font-bold text-emerald-600 shrink-0">{fmtBHD(revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
