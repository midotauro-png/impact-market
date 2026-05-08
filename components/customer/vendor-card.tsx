"use client";
import Link from "next/link";
import { Star, Clock, MapPin, Zap, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RankedVendor } from "@/lib/types";
import { useFavorites } from "@/lib/use-favorites";

interface VendorCardProps {
  vendor: RankedVendor;
  className?: string;
}

export default function VendorCard({ vendor, className }: VendorCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const faved = isFavorite(vendor.id);

  return (
    <div className={cn("card-hover block overflow-hidden group relative", className, !vendor.is_open && "opacity-70")}>
      <Link href={`/store/${vendor.id}`} className="block">
        {/* Cover */}
        <div className="relative h-40 overflow-hidden bg-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={vendor.cover_url}
            alt={vendor.business_name}
            className="h-full w-full object-cover transition group-hover:scale-105 duration-500"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {vendor.is_featured && (
              <span className="badge bg-orange-400 text-white text-[10px]"><Zap size={9} /> Featured</span>
            )}
            {vendor.same_zone && (
              <span className="badge bg-emerald-500 text-white text-[10px]">Same Zone</span>
            )}
            {!vendor.is_open && (
              <span className="badge bg-slate-700 text-white text-[10px]">Closed</span>
            )}
          </div>
          {/* Logo */}
          <div className="absolute -bottom-5 left-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vendor.logo_url}
              alt=""
              className="h-12 w-12 rounded-xl object-cover border-2 border-white shadow-card bg-white"
              loading="lazy"
            />
          </div>
        </div>

        {/* Info */}
        <div className="pt-7 px-4 pb-4">
          <h3 className="font-bold text-ink text-base leading-tight truncate">{vendor.business_name}</h3>
          <p className="text-xs text-slate-500 mt-0.5 truncate">{vendor.category_name} · {vendor.zone_name}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="font-semibold text-slate-700">{vendor.rating.toFixed(1)}</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {vendor.estimated_delivery_min} min
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {vendor.distance_km} km
            </span>
          </div>
        </div>
      </Link>

      {/* Favorite heart — outside Link to prevent navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); toggle(vendor.id); }}
        aria-label={faved ? "Remove from favorites" : "Save to favorites"}
        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow transition hover:scale-110 active:scale-95"
      >
        <Heart
          size={16}
          className={faved ? "fill-red-500 text-red-500" : "text-slate-400"}
        />
      </button>
    </div>
  );
}
