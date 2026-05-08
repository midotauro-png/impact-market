import { Suspense } from "react";
import Link from "next/link";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/brand/navbar";
import { categories, vendors } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";
import { rankVendors } from "@/lib/vendor-ranking";
import VendorCard from "@/components/customer/vendor-card";
import type { RankedVendor } from "@/lib/types";

interface PageProps {
  searchParams: { q?: string; category?: string; zone?: string };
}

export default function StoresPage({ searchParams }: PageProps) {
  const customerZoneId = searchParams.zone ?? "z-manama";
  const customerZone = ZONES.find((z) => z.id === customerZoneId);

  // Rank vendors based on a default Manama location (real app uses browser geolocation)
  const defaultLat = customerZone?.centroid.lat ?? 26.2154;
  const defaultLng = customerZone?.centroid.lng ?? 50.5860;

  const ranked: RankedVendor[] = rankVendors(vendors, categories, {
    customerLat: defaultLat,
    customerLng: defaultLng,
    customerZoneId,
    categoryId: searchParams.category
      ? categories.find((c) => c.slug === searchParams.category)?.id
      : undefined,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <Navbar />
      <div className="bg-navy-600 py-10 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-black mb-2">All Stores</h1>
          <p className="text-slate-300 text-sm">Showing {ranked.length} vendors near <span className="text-orange-300 font-semibold">{customerZone?.name ?? "Manama"}</span></p>

          {/* Search */}
          <form className="mt-5 flex gap-2 max-w-lg">
            <div className="flex-1 relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="q"
                type="text"
                defaultValue={searchParams.q}
                placeholder="Search stores or items…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-ink text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <button type="submit" className="btn-primary py-2.5">Search</button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <aside className="lg:w-60 shrink-0">
            {/* Zone select */}
            <div className="card p-4 mb-4">
              <p className="label flex items-center gap-1.5 mb-3"><MapPin size={12} className="text-orange-400" /> Your Zone</p>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {ZONES.filter((z) => z.is_active).map((z) => (
                  <Link
                    key={z.id}
                    href={`/stores?${new URLSearchParams({ ...searchParams, zone: z.id }).toString()}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${customerZoneId === z.id ? "bg-orange-50 text-orange-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    {z.name}
                    {customerZoneId === z.id && <span className="h-2 w-2 rounded-full bg-orange-400" />}
                  </Link>
                ))}
              </div>
            </div>

            {/* Category filter */}
            <div className="card p-4">
              <p className="label flex items-center gap-1.5 mb-3"><SlidersHorizontal size={12} /> Category</p>
              <div className="space-y-1">
                <Link
                  href={`/stores?${new URLSearchParams({ ...searchParams, category: "" }).toString()}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${!searchParams.category ? "bg-orange-50 text-orange-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                >
                  All categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/stores?${new URLSearchParams({ ...searchParams, category: c.slug }).toString()}`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${searchParams.category === c.slug ? "bg-orange-50 text-orange-600 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <span>{c.icon}</span> {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Vendor grid */}
          <div className="flex-1">
            {ranked.length === 0 ? (
              <div className="card p-16 text-center text-slate-400">
                <p className="text-2xl mb-2">🔍</p>
                <p className="font-semibold">No vendors found</p>
                <p className="text-sm mt-1">Try a different zone or category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {ranked.map((v) => (
                  <VendorCard key={v.id} vendor={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
