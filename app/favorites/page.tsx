"use client";
import { Heart } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/brand/navbar";
import VendorCard from "@/components/customer/vendor-card";
import { useFavorites } from "@/lib/use-favorites";
import { vendors, categories } from "@/lib/mock-data";
import { rankVendors } from "@/lib/vendor-ranking";

const DEFAULT_LAT = 26.2154;
const DEFAULT_LNG = 50.5860;
const DEFAULT_ZONE = "z-manama";

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const ranked = rankVendors(vendors, categories, {
    customerLat: DEFAULT_LAT,
    customerLng: DEFAULT_LNG,
    customerZoneId: DEFAULT_ZONE,
  }).filter((v) => favorites.has(v.id));

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Heart size={22} className="fill-red-500 text-red-500" />
          <h1 className="text-2xl font-black text-ink">Saved Stores</h1>
          <span className="text-sm text-slate-500 ml-1">({ranked.length})</span>
        </div>

        {ranked.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <Heart size={52} className="text-slate-200 mx-auto" />
            <p className="text-xl font-bold text-slate-400">No saved stores yet</p>
            <p className="text-sm text-slate-400">Tap the ♥ on any store to save it here.</p>
            <Link href="/stores" className="btn-primary inline-flex">Browse Stores</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {ranked.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
