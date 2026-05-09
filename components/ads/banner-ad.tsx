"use client";
import Link from "next/link";
import { ExternalLink, Zap } from "lucide-react";
import type { Ad } from "@/lib/types";

interface BannerAdProps {
  ad: Ad;
  className?: string;
  compact?: boolean;
}

export default function BannerAd({ ad, className = "", compact = false }: BannerAdProps) {
  if (compact) {
    return (
      <div className={`relative overflow-hidden rounded-xl border border-slate-100 shadow-sm ${className}`}>
        <Link href={ad.target_url} target={ad.advertiser_type === "external" ? "_blank" : undefined} rel="noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ad.image_url}
            alt={ad.title}
            className="w-full h-28 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-3 right-10">
            <p className="text-white font-bold text-xs leading-tight line-clamp-2">{ad.title}</p>
          </div>
        </Link>
        <span className="absolute top-2 right-2 text-[9px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Zap size={8} /> Sponsored
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl shadow-card ${className}`}>
      <Link href={ad.target_url} target={ad.advertiser_type === "external" ? "_blank" : undefined} rel="noreferrer" className="block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ad.image_url}
          alt={ad.title}
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end p-5">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full mb-2">
              <Zap size={9} /> Sponsored
            </span>
            <h3 className="text-white font-black text-lg leading-tight drop-shadow">{ad.title}</h3>
            {ad.description && (
              <p className="text-white/80 text-sm mt-1 line-clamp-2">{ad.description}</p>
            )}
            <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-full hover:bg-white/30 transition">
              {ad.advertiser_type === "external" ? <><ExternalLink size={11} /> Visit</> : "Order Now →"}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-2 right-3 text-[9px] text-white/50">Ad</div>
    </div>
  );
}
