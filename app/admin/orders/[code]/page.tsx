import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import { orderById, vendorById, drivers } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import { zoneById } from "@/lib/zones";

interface PageProps { params: { code: string } }

export default function AdminOrderDetailPage({ params }: PageProps) {
  const order = orderById(params.code);
  if (!order) return notFound();

  const vendor   = vendorById(order.vendor_id);
  const driver   = order.driver_id ? drivers.find((d) => d.id === order.driver_id) : null;
  const cZone    = zoneById(order.customer_zone_id);
  const vZone    = zoneById(order.vendor_zone_id);

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="btn-ghost btn-sm"><ArrowLeft size={14} /> Back</Link>
        <h2 className="text-xl font-black text-ink">Order {order.short_code}</h2>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="card p-4 space-y-2 text-sm">
          <p className="label">Customer</p>
          <p className="font-bold text-ink">{order.customer_name}</p>
          <p className="text-slate-500">{order.customer_phone}</p>
          <p className="text-slate-500">{order.delivery_address}</p>
          <p className="text-slate-400 text-xs">Zone: {cZone?.name}</p>
        </div>
        <div className="card p-4 space-y-2 text-sm">
          <p className="label">Vendor</p>
          <p className="font-bold text-ink">{vendor?.business_name}</p>
          <p className="text-slate-500">{vendor?.address}</p>
          <p className="text-slate-400 text-xs">Zone: {vZone?.name}</p>
          <p className="label mt-3">Driver</p>
          {driver ? (
            <><p className="font-bold text-ink">{driver.full_name}</p>
              <p className="text-slate-500">{driver.phone} · {driver.vehicle_plate}</p></>
          ) : <p className="text-slate-400">Not assigned</p>}
        </div>
      </div>

      {/* Items */}
      <div className="card p-4">
        <p className="label mb-3">Items</p>
        <div className="space-y-2">
          {order.items.map((item) => (
            <div key={item.product_id} className="flex justify-between text-sm">
              <span>{item.name} <span className="text-slate-400">×{item.quantity}</span></span>
              <span className="font-semibold">{fmtBHD(item.price_fils * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Financials */}
      <div className="card p-4">
        <p className="label mb-3">Financial Breakdown</p>
        <div className="space-y-2 text-sm">
          {[
            { label: "Subtotal (GMV)",      value: fmtBHD(order.subtotal_fils),       cls: "" },
            { label: "Delivery Fee",         value: fmtBHD(order.delivery_fee_fils),   cls: "" },
            { label: "Service Fee",          value: fmtBHD(order.service_fee_fils),    cls: "" },
            { label: "Platform Commission",  value: fmtBHD(order.commission_fils),     cls: "text-emerald-600 font-semibold" },
            { label: "Driver Payout",        value: fmtBHD(order.driver_payout_fils),  cls: "text-purple-600" },
            { label: "Vendor Net",           value: fmtBHD(order.vendor_net_fils),     cls: "text-blue-600" },
            { label: "Admin Profit",         value: fmtBHD(order.admin_profit_fils),   cls: "text-orange-600 font-bold" },
            { label: "Customer Total Paid",  value: fmtBHD(order.total_fils),          cls: "font-black text-ink text-base border-t pt-2 mt-1" },
          ].map((r) => (
            <div key={r.label} className={`flex justify-between ${r.cls}`}>
              <span className="text-slate-500">{r.label}</span>
              <span>{r.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-ghost btn-sm">Update Status</button>
        <button className="btn-danger btn-sm">Cancel Order</button>
      </div>
    </div>
  );
}
