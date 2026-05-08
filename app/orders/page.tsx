"use client";
import Link from "next/link";
import { Package, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import StatusBadge from "@/components/ui/status-badge";
import { orders, vendorById } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";

// Demo: show all orders as if they belong to the current customer
export default function OrdersPage() {
  const myOrders = [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (myOrders.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 text-center px-6">
          <Package size={52} className="text-slate-300" />
          <h2 className="text-2xl font-bold text-ink">No orders yet</h2>
          <Link href="/stores" className="btn-primary">Start Ordering</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-black text-ink mb-7">My Orders</h1>
        <div className="space-y-4">
          {myOrders.map((order) => {
            const vendor = vendorById(order.vendor_id);
            return (
              <Link
                key={order.id}
                href={`/orders/${order.short_code}`}
                className="card-hover flex items-center gap-4 p-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={vendor?.logo_url ?? ""}
                  alt={vendor?.business_name}
                  className="h-14 w-14 rounded-xl object-cover bg-slate-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink truncate">{vendor?.business_name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {order.items.length} item{order.items.length > 1 ? "s" : ""} · {fmtBHD(order.total_fils)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={order.status} />
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock size={10} /> {relTime(order.created_at)}
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
