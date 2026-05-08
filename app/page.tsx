import Link from "next/link";
import { MapPin, Search, Zap, Shield, Star, ArrowRight, ChevronRight } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import ZoneBanner from "@/components/customer/zone-banner";
import { categories, vendors } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";

export default function HomePage() {
  const featuredVendors = vendors.filter((v) => v.status === "approved" && v.is_open).slice(0, 6);
  const topCategories = categories.slice(0, 8);

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-navy-600 text-white">
        {/* decorative circles */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-[560px] w-[560px] rounded-full bg-orange-400/10" />
        <div className="pointer-events-none absolute top-24 -left-20 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-24 text-center">
          {/* Big logo — clearly visible in hero */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Impact Market — Inspire"
            className="mx-auto mb-6 w-64 sm:w-80 md:w-96 object-contain drop-shadow-2xl"
          />

          <span className="inline-flex items-center gap-2 bg-orange-400/20 border border-orange-400/30 rounded-full px-4 py-1.5 text-orange-300 text-xs font-semibold mb-6">
            <Zap size={12} /> Bahrain&apos;s #1 Local Marketplace
          </span>

          <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight max-w-3xl mx-auto">
            Order from <span className="text-orange-400">Local Vendors</span><br />Delivered Fast.
          </h1>
          <p className="mt-5 text-slate-300 text-lg max-w-xl mx-auto">
            Food, bakeries, groceries, fashion, oud &amp; more — from Muharraq to Riffa, delivered in under 45 minutes.
          </p>

          {/* Search bar */}
          <form action="/stores" method="get" className="mt-10 max-w-xl mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                type="text"
                placeholder="Search stores, food, items…"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button type="submit" className="btn-primary py-3.5">
              Search
            </button>
          </form>

          {/* Zone detection banner */}
          <div className="mt-6 max-w-xl mx-auto">
            <ZoneBanner />
          </div>

          {/* Zone pills */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {ZONES.filter((z) => z.is_active).slice(0, 8).map((z) => (
              <Link
                key={z.id}
                href={`/stores?zone=${z.id}`}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-orange-400/20 border border-white/15 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full transition"
              >
                <MapPin size={10} className="text-orange-300" />
                {z.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-7">
          <h2 className="text-2xl font-black text-ink">Browse Categories</h2>
          <Link href="/stores" className="text-orange-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {topCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/stores?category=${cat.slug}`}
              className="card-hover flex flex-col items-center gap-2 p-3 text-center"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-semibold text-slate-700 leading-tight">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Vendors ──────────────────────────────────────────────── */}
      <section className="bg-slate-50 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-black text-ink">Featured Stores</h2>
            <Link href="/stores" className="text-orange-400 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredVendors.map((v) => (
              <Link key={v.id} href={`/store/${v.id}`} className="card-hover block overflow-hidden group">
                <div className="h-44 bg-slate-200 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.cover_url} alt={v.business_name} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
                  {v.is_featured && (
                    <span className="absolute top-3 left-3 badge bg-orange-400 text-white text-[10px]"><Zap size={9} /> Featured</span>
                  )}
                </div>
                <div className="flex gap-3 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.logo_url} alt="" className="h-12 w-12 rounded-xl object-cover border border-slate-100 shrink-0" loading="lazy" />
                  <div className="min-w-0">
                    <h3 className="font-bold text-ink truncate">{v.business_name}</h3>
                    <p className="text-xs text-slate-500">{categories.find((c) => c.id === v.category_id)?.name} · {v.address}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Star size={10} className="fill-amber-400 text-amber-400" /> <span className="font-semibold text-slate-700">{v.rating}</span></span>
                      <span>{v.total_orders} orders</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value Props ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="text-2xl font-black text-ink text-center mb-10">Why Bahrain Marketplace?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: <Zap className="text-orange-400" size={28} />, title: "Zone-Smart Delivery", desc: "Our algorithm finds the closest vendor to you for the fastest, cheapest delivery." },
            { icon: <Star className="text-amber-400" size={28} />, title: "Verified Local Vendors", desc: "Every business is verified with a CR number and admin approval." },
            { icon: <Shield className="text-emerald-500" size={28} />, title: "Secure Payments", desc: "Pay safely online via Tap Payments or choose Cash on Delivery." },
          ].map((p) => (
            <div key={p.title} className="card p-6 flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 shadow-soft">
                {p.icon}
              </div>
              <div>
                <h3 className="font-bold text-ink text-base">{p.title}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sell on Marketplace CTA ───────────────────────────────────────── */}
      <section className="bg-navy-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-3">Sell on Bahrain Marketplace</h2>
          <p className="text-slate-300 mb-8">Reach thousands of customers across all Bahrain governorates. Register your business today.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/vendor/signup" className="btn-primary">
              Register as Vendor <ArrowRight size={14} />
            </Link>
            <Link href="/driver/signup" className="btn-ghost border-white/30 text-white hover:bg-white/10">
              Become a Driver
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="font-semibold text-white">Bahrain Marketplace</p>
          <div className="flex gap-5">
            <Link href="/admin" className="hover:text-white transition">Admin</Link>
            <Link href="/vendor/signup" className="hover:text-white transition">Vendors</Link>
            <Link href="/driver/signup" className="hover:text-white transition">Drivers</Link>
          </div>
          <p>© {new Date().getFullYear()} Bahrain Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
