"use client";
import { useState } from "react";
import { Navigation, MapPin, Phone, CheckCircle, Package } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { ordersByDriver, vendorById } from "@/lib/mock-data";
import { fmtBHD } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

const DEMO_DRIVER_ID = "d-1";

const STEPS: { status: OrderStatus; label: string; action: string }[] = [
  { status: "driver_assigned",  label: "Head to vendor",     action: "Confirm Pick Up" },
  { status: "driver_picked_up", label: "Picked up order",    action: "Start Delivery" },
  { status: "on_the_way",       label: "On the way",         action: "Mark as Delivered" },
  { status: "delivered",        label: "Order delivered! 🎉", action: "" },
];

export default function DriverDeliveryPage() {
  const allOrders = ordersByDriver(DEMO_DRIVER_ID);
  const [orders, setOrders] = useState(allOrders);

  const active = orders.find((o) =>
    ["driver_assigned", "driver_picked_up", "on_the_way"].includes(o.status)
  );

  function advance() {
    if (!active) return;
    const nextMap: Record<string, OrderStatus> = {
      driver_assigned: "driver_picked_up",
      driver_picked_up: "on_the_way",
      on_the_way: "delivered",
    };
    const next = nextMap[active.status];
    if (next) {
      setOrders((prev) => prev.map((o) => o.id === active.id ? { ...o, status: next } : o));
    }
  }

  const step = STEPS.find((s) => s.status === active?.status);
  const vendor = active ? vendorById(active.vendor_id) : null;

  if (!active) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
        <Package size={52} className="text-slate-300" />
        <h3 className="text-xl font-bold text-ink">No Active Delivery</h3>
        <p className="text-slate-500 text-sm max-w-xs">You have no active delivery. Go online from the dashboard to receive orders.</p>
      </div>
    );
  }

  const isDelivered = active.status === "delivered";

  return (
    <div className="space-y-5 max-w-lg">
      <h2 className="text-xl font-black text-ink">Active Delivery</h2>

      {/* Status banner */}
      <div className={`card p-5 border-2 ${isDelivered ? "border-emerald-400 bg-emerald-50" : "border-orange-300 bg-orange-50"}`}>
        <div className="flex items-center gap-3 mb-2">
          {isDelivered
            ? <CheckCircle size={24} className="text-emerald-500" />
            : <Navigation size={24} className="text-orange-400 animate-pulse" />}
          <div>
            <p className="font-black text-ink text-base">{step?.label}</p>
            <span className="font-mono text-xs text-orange-500">{active.short_code}</span>
          </div>
        </div>

        {/* Step progress */}
        <div className="flex gap-1.5 mt-4">
          {STEPS.slice(0, 3).map((s, i) => {
            const idx = STEPS.findIndex((x) => x.status === active.status);
            return (
              <div key={s.status} className={`flex-1 h-2 rounded-full transition ${i <= idx ? "bg-orange-400" : "bg-slate-200"}`} />
            );
          })}
        </div>
      </div>

      {/* Vendor pickup */}
      <div className="card p-4">
        <p className="label flex items-center gap-1.5 mb-3">
          <MapPin size={12} className="text-orange-400" /> Pick Up From
        </p>
        <div className="flex items-center gap-3">
          {vendor?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vendor.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100" />
          )}
          <div>
            <p className="font-bold text-ink text-sm">{vendor?.business_name}</p>
            <p className="text-xs text-slate-500">{vendor?.address}</p>
          </div>
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${vendor?.lat},${vendor?.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost btn-sm mt-3 w-full justify-center"
        >
          <Navigation size={13} /> Navigate to Vendor
        </a>
      </div>

      {/* Customer delivery */}
      <div className="card p-4">
        <p className="label flex items-center gap-1.5 mb-3">
          <MapPin size={12} className="text-emerald-500" /> Deliver To
        </p>
        <p className="font-bold text-ink text-sm">{active.customer_name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{active.delivery_address}</p>
        <div className="flex gap-2 mt-3">
          <a href={`tel:${active.customer_phone}`} className="btn-ghost btn-sm flex-1 justify-center">
            <Phone size={13} /> Call Customer
          </a>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${active.delivery_lat},${active.delivery_lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-sm flex-1 justify-center"
          >
            <Navigation size={13} /> Navigate
          </a>
        </div>
      </div>

      {/* Order items */}
      <div className="card p-4">
        <p className="label mb-3">Order Items</p>
        <div className="space-y-1.5">
          {active.items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span className="text-slate-700">{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
              <span className="font-semibold">{fmtBHD(item.price_fils * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t flex justify-between text-sm font-bold text-ink">
          <span>Your Payout</span>
          <span className="text-emerald-600">{fmtBHD(active.driver_payout_fils)}</span>
        </div>
        {active.payment_method === "cash_on_delivery" && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-semibold">
            💵 Collect <span className="font-black">{fmtBHD(active.total_fils)}</span> cash from customer
          </div>
        )}
      </div>

      {/* Action button */}
      {!isDelivered && step?.action && (
        <button onClick={advance} className="btn-primary w-full justify-center py-4 text-base">
          {step.action} ✓
        </button>
      )}

      {isDelivered && (
        <div className="card p-5 text-center space-y-2 border-emerald-200">
          <CheckCircle size={40} className="text-emerald-500 mx-auto" />
          <p className="font-bold text-ink">Delivery Complete!</p>
          <p className="text-sm text-slate-500">{fmtBHD(active.driver_payout_fils)} will be added to your wallet.</p>
        </div>
      )}
    </div>
  );
}
