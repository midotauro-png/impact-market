"use client";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import { useCart } from "@/lib/cart-store";
import { fmtBHD } from "@/lib/utils";
import { calculateDeliveryFee } from "@/lib/zones";
import { DEFAULT_SETTINGS } from "@/lib/profit-calc";

const CUSTOMER_ZONE_ID = "z-manama"; // In real app: from user profile / geolocation

export default function CartPage() {
  const { items, setQty, remove, clear, vendorId, zoneId } = useCart();

  const subtotal = items.reduce((s, i) => s + i.price_fils * i.quantity, 0);
  const deliveryResult = zoneId
    ? calculateDeliveryFee(CUSTOMER_ZONE_ID, zoneId, {
        same_fils: DEFAULT_SETTINGS.same_zone_delivery_fils,
        near_fils: DEFAULT_SETTINGS.near_zone_delivery_fils,
        mid_fils: DEFAULT_SETTINGS.mid_zone_delivery_fils,
        far_fils: DEFAULT_SETTINGS.far_zone_delivery_fils,
      })
    : { fee_fils: DEFAULT_SETTINGS.near_zone_delivery_fils, label: "Standard" };
  const serviceFee = DEFAULT_SETTINGS.service_fee_fils;
  const total = subtotal + deliveryResult.fee_fils + serviceFee;

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 text-center px-6">
          <ShoppingCart size={56} className="text-slate-300" />
          <div>
            <h2 className="text-2xl font-bold text-ink">Your cart is empty</h2>
            <p className="text-slate-500 mt-2">Browse stores and add items to get started.</p>
          </div>
          <Link href="/stores" className="btn-primary">Browse Stores</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-7">
          <Link href="/stores" className="btn-ghost btn-sm"><ArrowLeft size={14} /> Back</Link>
          <h1 className="text-2xl font-black text-ink">Your Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={item.product_id} className="card flex gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image || "/placeholder.jpg"} alt={item.name} className="h-20 w-20 rounded-xl object-cover bg-slate-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-ink text-sm">{item.name}</h3>
                  <p className="text-orange-500 font-black mt-1">{fmtBHD(item.price_fils)}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button onClick={() => setQty(item.product_id, item.quantity - 1)} className="btn-ghost btn-sm p-1.5"><Minus size={12} /></button>
                    <span className="w-7 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => setQty(item.product_id, item.quantity + 1)} className="btn-primary btn-sm p-1.5"><Plus size={12} /></button>
                    <button onClick={() => remove(item.product_id)} className="ml-auto btn-ghost btn-sm text-red-500 hover:bg-red-50">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-ink">{fmtBHD(item.price_fils * item.quantity)}</p>
                </div>
              </div>
            ))}

            <button onClick={() => clear()} className="btn-ghost btn-sm text-red-500">
              <Trash2 size={13} /> Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-5 space-y-4 sticky top-20">
              <h2 className="font-bold text-ink text-base">Order Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>{fmtBHD(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Delivery ({deliveryResult.label})</span>
                  <span>{fmtBHD(deliveryResult.fee_fils)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service fee</span>
                  <span>{fmtBHD(serviceFee)}</span>
                </div>
                <div className="border-t pt-2.5 flex justify-between font-black text-ink text-base">
                  <span>Total</span>
                  <span className="text-orange-500">{fmtBHD(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </Link>
              <p className="text-xs text-slate-400 text-center">Secure checkout · Cash on delivery available</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
