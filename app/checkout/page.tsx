"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CreditCard, Banknote, CheckCircle } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import { useCart } from "@/lib/cart-store";
import { fmtBHD } from "@/lib/utils";
import { calculateDeliveryFee, ZONES } from "@/lib/zones";
import { DEFAULT_SETTINGS } from "@/lib/profit-calc";

const CUSTOMER_ZONE_ID = "z-manama";

export default function CheckoutPage() {
  const { items, zoneId, clear } = useCart();
  const [payMethod, setPayMethod] = useState<"online" | "cod">("online");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!address || !phone || !name) { setErrorMsg("Please fill in all fields."); return; }
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name, customer_phone: phone,
          delivery_address: address, customer_zone_id: CUSTOMER_ZONE_ID,
          items, payment_method: payMethod,
        }),
      });
      const data = await res.json();
      if (data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        clear();
        setDone(true);
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-6">
          <CheckCircle size={64} className="text-emerald-500" />
          <h2 className="text-3xl font-black text-ink">Order Placed!</h2>
          <p className="text-slate-500 max-w-xs">Your order has been received. You&apos;ll get updates via SMS.</p>
          <Link href="/orders" className="btn-primary">Track Order</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-7">
          <Link href="/cart" className="btn-ghost btn-sm"><ArrowLeft size={14} /> Cart</Link>
          <h1 className="text-2xl font-black text-ink">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-5">
            {/* Delivery details */}
            <div className="card p-5">
              <h2 className="font-bold text-ink mb-4 flex items-center gap-2"><MapPin size={16} className="text-orange-400" /> Delivery Details</h2>
              <div className="space-y-3">
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input className="input" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Phone (WhatsApp)</label>
                  <input className="input" placeholder="+973 3X XX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Delivery Address</label>
                  <textarea className="input" rows={3} placeholder="Block, road, building number…" value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="label">Zone</label>
                  <select className="input" defaultValue={CUSTOMER_ZONE_ID}>
                    {ZONES.filter((z) => z.is_active).map((z) => (
                      <option key={z.id} value={z.id}>{z.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-5">
              <h2 className="font-bold text-ink mb-4 flex items-center gap-2"><CreditCard size={16} className="text-orange-400" /> Payment Method</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "online", label: "Pay Online", icon: <CreditCard size={20} />, desc: "Tap, KNET, credit card" },
                  { id: "cod", label: "Cash on Delivery", icon: <Banknote size={20} />, desc: "Pay when delivered" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id as "online" | "cod")}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-sm font-semibold ${payMethod === m.id ? "border-orange-400 bg-orange-50 text-orange-600" : "border-slate-200 hover:border-slate-300"}`}
                  >
                    {m.icon}
                    <span>{m.label}</span>
                    <span className="text-xs font-normal text-slate-500">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
          </div>

          {/* Summary */}
          <div className="card p-5 space-y-4 h-fit sticky top-20">
            <h2 className="font-bold text-ink">Order Summary</h2>
            <div className="space-y-2 text-sm text-slate-600">
              {items.map((i) => (
                <div key={i.product_id} className="flex justify-between">
                  <span className="truncate mr-2">{i.name} ×{i.quantity}</span>
                  <span className="shrink-0 font-semibold">{fmtBHD(i.price_fils * i.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-2 space-y-1.5">
                <div className="flex justify-between"><span>Delivery</span><span>{fmtBHD(deliveryResult.fee_fils)}</span></div>
                <div className="flex justify-between"><span>Service fee</span><span>{fmtBHD(serviceFee)}</span></div>
                <div className="flex justify-between font-black text-ink text-base pt-1.5 border-t">
                  <span>Total</span><span className="text-orange-500">{fmtBHD(total)}</span>
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? "Placing Order…" : `Place Order · ${fmtBHD(total)}`}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
