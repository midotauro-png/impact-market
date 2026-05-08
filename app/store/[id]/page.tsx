"use client";
import { notFound } from "next/navigation";
import { Clock, MapPin, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import { vendorById, productsByVendor, categoryById } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-store";
import { fmtBHD } from "@/lib/utils";
import { zoneById } from "@/lib/zones";
import type { Product } from "@/lib/types";

interface PageProps { params: { id: string } }

export default function StorePage({ params }: PageProps) {
  const { items, add, setQty } = useCart();

  const vendor = vendorById(params.id);
  if (!vendor) return notFound();

  const products = productsByVendor(params.id);
  const category = categoryById(vendor.category_id);
  const zone = zoneById(vendor.zone_id);

  function getQty(productId: string) {
    return items.find((i) => i.product_id === productId)?.quantity ?? 0;
  }

  function handleAdd(product: Product) {
    add(
      { product_id: product.id, vendor_id: vendor!.id, name: product.name, price_fils: product.price_fils, quantity: 1, image: product.images[0] ?? "" },
      vendor!.zone_id
    );
  }

  return (
    <>
      <Navbar />

      {/* Cover */}
      <div className="relative h-52 bg-slate-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={vendor.cover_url} alt={vendor.business_name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        {/* Vendor header */}
        <div className="card p-5 flex gap-4 items-start mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={vendor.logo_url} alt={vendor.business_name} className="h-20 w-20 rounded-2xl object-cover border-2 border-white shadow-card shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-ink">{vendor.business_name}</h1>
              <span className={`badge ${vendor.is_open ? "badge-green" : "badge-red"}`}>
                {vendor.is_open ? "Open" : "Closed"}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{category?.name} · {vendor.address}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" /> <span className="font-semibold text-slate-700">{vendor.rating}</span> ({vendor.total_orders} orders)</span>
              <span className="flex items-center gap-1"><MapPin size={11} className="text-orange-400" /> {zone?.name}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {zone?.estimated_delivery_min} min est.</span>
            </div>
          </div>
        </div>

        {/* Products */}
        <h2 className="text-lg font-bold text-ink mb-4">Menu / Products</h2>
        {products.length === 0 ? (
          <div className="card p-12 text-center text-slate-400">No products listed yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-24">
            {products.map((p) => {
              const qty = getQty(p.id);
              return (
                <div key={p.id} className="card flex gap-4 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.images[0]} alt={p.name} className="h-24 w-24 rounded-xl object-cover shrink-0 bg-slate-100" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-ink text-sm leading-snug">{p.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-black text-orange-500 text-base">{fmtBHD(p.price_fils)}</span>
                      {qty === 0 ? (
                        <button onClick={() => handleAdd(p)} className="btn-primary btn-sm flex items-center gap-1">
                          <Plus size={13} /> Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button onClick={() => setQty(p.id, qty - 1)} className="btn-ghost btn-sm p-1.5"><Minus size={13} /></button>
                          <span className="w-6 text-center font-bold text-ink text-sm">{qty}</span>
                          <button onClick={() => setQty(p.id, qty + 1)} className="btn-primary btn-sm p-1.5"><Plus size={13} /></button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky cart bar */}
      {items.length > 0 && items[0].vendor_id === vendor.id && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-100 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.12)]">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-400 text-white font-bold text-sm">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
              <div>
                <p className="text-sm font-bold text-ink">{items.length} item{items.length > 1 ? "s" : ""} in cart</p>
                <p className="text-xs text-slate-500">{fmtBHD(items.reduce((s, i) => s + i.price_fils * i.quantity, 0))}</p>
              </div>
            </div>
            <a href="/cart" className="btn-primary flex items-center gap-2">
              <ShoppingCart size={15} /> View Cart
            </a>
          </div>
        </div>
      )}
    </>
  );
}
