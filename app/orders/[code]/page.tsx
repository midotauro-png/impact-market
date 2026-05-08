import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, User, Truck, Package, ReceiptText } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import StatusBadge from "@/components/ui/status-badge";
import { orderById, vendorById, drivers } from "@/lib/mock-data";
import { fmtBHD, relTime, ORDER_STATUS_LABEL } from "@/lib/utils";
import { zoneById } from "@/lib/zones";

// Live order status timeline
const STATUS_STEPS = [
  "pending_payment",
  "paid",
  "vendor_accepted",
  "vendor_preparing",
  "driver_assigned",
  "driver_picked_up",
  "on_the_way",
  "delivered",
] as const;

interface PageProps { params: { code: string } }

export default function OrderDetailPage({ params }: PageProps) {
  const order = orderById(params.code);
  if (!order) return notFound();

  const vendor = vendorById(order.vendor_id);
  const driver = order.driver_id ? drivers.find((d) => d.id === order.driver_id) : null;
  const customerZone = zoneById(order.customer_zone_id);
  const vendorZone = zoneById(order.vendor_zone_id);
  const currentStep = STATUS_STEPS.indexOf(order.status as typeof STATUS_STEPS[number]);

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
        <div className="flex items-center gap-3">
          <Link href="/orders" className="btn-ghost btn-sm"><ArrowLeft size={14} /> Orders</Link>
          <h1 className="text-xl font-black text-ink">Order #{order.short_code}</h1>
        </div>

        {/* Status card */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <StatusBadge status={order.status} />
            <span className="text-xs text-slate-400">{relTime(order.created_at)}</span>
          </div>

          {/* Timeline */}
          {order.status !== "cancelled" && order.status !== "refunded" && (
            <div className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200" />
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={step} className="flex items-center gap-3 mb-3 last:mb-0 relative">
                    <div className={`absolute -left-6 h-4 w-4 rounded-full border-2 flex items-center justify-center ${done ? "bg-orange-400 border-orange-400" : "bg-white border-slate-300"}`}>
                      {done && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                    <p className={`text-sm ${active ? "font-bold text-ink" : done ? "font-semibold text-slate-500" : "text-slate-300"}`}>
                      {ORDER_STATUS_LABEL[step]}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card p-4">
            <p className="label flex items-center gap-1.5 mb-3"><Package size={12} /> Vendor</p>
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={vendor?.logo_url} alt="" className="h-10 w-10 rounded-lg object-cover bg-slate-100" />
              <div>
                <p className="font-bold text-ink text-sm">{vendor?.business_name}</p>
                <p className="text-xs text-slate-500">{vendorZone?.name}</p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <p className="label flex items-center gap-1.5 mb-3"><Truck size={12} /> Driver</p>
            {driver ? (
              <div>
                <p className="font-bold text-ink text-sm">{driver.full_name}</p>
                <p className="text-xs text-slate-500">{driver.phone} · {driver.vehicle_type} {driver.vehicle_plate}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Not yet assigned</p>
            )}
          </div>
        </div>

        {/* Delivery address */}
        <div className="card p-4">
          <p className="label flex items-center gap-1.5 mb-2"><MapPin size={12} className="text-orange-400" /> Delivery Address</p>
          <p className="text-sm text-slate-700">{order.delivery_address}</p>
          <p className="text-xs text-slate-400 mt-1">Zone: {customerZone?.name}</p>
        </div>

        {/* Items */}
        <div className="card p-4">
          <p className="label flex items-center gap-1.5 mb-3"><ReceiptText size={12} /> Items</p>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <span className="text-slate-700">{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
                <span className="font-semibold">{fmtBHD(item.price_fils * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t mt-3 pt-3 space-y-1.5 text-sm text-slate-500">
            <div className="flex justify-between"><span>Subtotal</span><span>{fmtBHD(order.subtotal_fils)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{fmtBHD(order.delivery_fee_fils)}</span></div>
            <div className="flex justify-between"><span>Service fee</span><span>{fmtBHD(order.service_fee_fils)}</span></div>
            <div className="flex justify-between font-black text-ink text-base border-t pt-2 mt-2">
              <span>Total</span><span className="text-orange-500">{fmtBHD(order.total_fils)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
