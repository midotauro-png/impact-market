"use client";
import { useState } from "react";
import { ToggleLeft, ToggleRight, MapPin, Navigation, Star, Package } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { drivers, ordersByDriver } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import { zoneById } from "@/lib/zones";
import type { OrderStatus } from "@/lib/types";

const DEMO_DRIVER_ID = "d-1";

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  driver_assigned: "driver_picked_up",
  driver_picked_up: "on_the_way",
  on_the_way: "delivered",
};

export default function DriverDashboardPage() {
  const driver = drivers.find((d) => d.id === DEMO_DRIVER_ID)!;
  const [isOnline, setIsOnline] = useState(driver.is_online);
  const [orders, setOrders] = useState(ordersByDriver(DEMO_DRIVER_ID));
  const zone = zoneById(driver.active_zone_id);

  const activeOrders = orders.filter((o) => ["driver_assigned","driver_picked_up","on_the_way"].includes(o.status));
  const todayEarnings = orders.filter((o) => o.status === "delivered").reduce((s, o) => s + o.driver_payout_fils, 0);

  function advance(id: string, status: OrderStatus) {
    const next = NEXT[status];
    if (!next) return;
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next } : o));
  }

  return (
    <div className="space-y-6">
      {/* Driver info + online toggle */}
      <div className="card p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-black text-purple-600 shrink-0">
          {driver.full_name[0]}
        </div>
        <div className="flex-1">
          <p className="font-black text-ink text-lg">{driver.full_name}</p>
          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            <MapPin size={12} className="text-orange-400" /> {zone?.name ?? driver.active_zone_id}
            <span className="mx-1">·</span>
            {driver.vehicle_type} {driver.vehicle_plate}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative flex h-8 w-16 rounded-full transition ${isOnline ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${isOnline ? "translate-x-8" : "translate-x-1"}`} />
          </button>
          <span className={`text-xs font-bold ${isOnline ? "text-emerald-600" : "text-slate-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Today Earnings", value: fmtBHD(todayEarnings), icon: "💵" },
          { label: "Active Orders", value: activeOrders.length, icon: "📦" },
          { label: "Rating", value: `${driver.rating} ★`, icon: "⭐" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="stat-value text-xl">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active deliveries */}
      <div>
        <h3 className="font-bold text-ink mb-3">Active Deliveries</h3>
        {activeOrders.length === 0 ? (
          <div className="card p-10 text-center space-y-2">
            <Package size={40} className="text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-400">{isOnline ? "Waiting for orders…" : "Go online to receive deliveries"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map((o) => (
              <div key={o.id} className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-orange-500">{o.short_code}</span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Pick Up</p>
                    <p className="font-semibold text-ink text-xs">{o.delivery_address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Deliver To</p>
                    <p className="font-semibold text-ink text-xs">{o.customer_name} · {o.customer_phone}</p>
                    <p className="text-xs text-slate-500">{o.delivery_address}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600">{fmtBHD(o.driver_payout_fils)} payout</span>
                  <div className="flex gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${o.delivery_lat},${o.delivery_lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost btn-sm flex items-center gap-1"
                    >
                      <Navigation size={12} /> Navigate
                    </a>
                    {NEXT[o.status] && (
                      <button onClick={() => advance(o.id, o.status)} className="btn-primary btn-sm">
                        {o.status === "driver_assigned" && "Picked Up ✓"}
                        {o.status === "driver_picked_up" && "On the Way ✓"}
                        {o.status === "on_the_way" && "Delivered ✓"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
