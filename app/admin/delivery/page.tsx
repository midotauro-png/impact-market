import Link from "next/link";
import { Navigation, MapPin, Clock } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { orders, drivers } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import { zoneById } from "@/lib/zones";

export default function AdminDeliveryPage() {
  const activeDeliveries = orders.filter((o) =>
    ["driver_assigned", "driver_picked_up", "on_the_way"].includes(o.status)
  );
  const onlineDrivers = drivers.filter((d) => d.is_online && d.status === "approved");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-ink">Live Delivery Map</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Deliveries", value: activeDeliveries.length, color: "text-orange-500" },
          { label: "Drivers Online", value: onlineDrivers.length, color: "text-emerald-600" },
          { label: "Pending Assignment", value: orders.filter((o) => o.status === "vendor_preparing").length, color: "text-amber-600" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className={`stat-value text-3xl ${s.color}`}>{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active deliveries table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">Active Deliveries</div>
        {activeDeliveries.length === 0 ? (
          <p className="p-6 text-slate-400 text-sm text-center">No active deliveries.</p>
        ) : (
          <div className="table-wrapper rounded-none rounded-b-2xl">
            <table className="data-table">
              <thead><tr>
                <th>Order</th><th>Customer</th><th>Zone</th>
                <th>Driver</th><th>Status</th><th>Time</th>
              </tr></thead>
              <tbody>
                {activeDeliveries.map((o) => {
                  const driver = drivers.find((d) => d.id === o.driver_id);
                  const cZone = zoneById(o.customer_zone_id);
                  return (
                    <tr key={o.id}>
                      <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                      <td>
                        <p className="font-semibold text-ink text-sm">{o.customer_name}</p>
                        <p className="text-xs text-slate-400">{o.delivery_address}</p>
                      </td>
                      <td className="text-xs flex items-center gap-1 text-slate-600">
                        <MapPin size={10} className="text-orange-400" />{cZone?.name}
                      </td>
                      <td className="text-xs font-semibold">{driver?.full_name ?? "Unassigned"}</td>
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

      {/* Online drivers */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">
          Online Drivers ({onlineDrivers.length})
        </div>
        <div className="divide-y divide-slate-100">
          {onlineDrivers.map((d) => {
            const zone = zoneById(d.active_zone_id);
            const currentOrder = orders.find((o) => o.driver_id === d.id && ["driver_assigned","driver_picked_up","on_the_way"].includes(o.status));
            return (
              <div key={d.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="font-semibold text-ink text-sm">{d.full_name}</p>
                  <p className="text-xs text-slate-400">{d.phone} · {d.vehicle_type} {d.vehicle_plate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-600">{zone?.name}</p>
                  {currentOrder ? (
                    <span className="badge-orange text-[10px]">On delivery</span>
                  ) : (
                    <span className="badge-green text-[10px]">Available</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
