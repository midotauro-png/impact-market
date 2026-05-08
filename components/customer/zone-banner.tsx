"use client";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { useZoneDetect } from "@/lib/use-zone-detect";
import { useRouter } from "next/navigation";

export default function ZoneBanner() {
  const { zone, loading, error, detect } = useZoneDetect();
  const router = useRouter();

  function handleDetect() {
    detect();
    if (zone) {
      router.push(`/stores?zone=${zone.id}`);
    }
  }

  if (loading) {
    return (
      <div className="bg-navy-600/5 border border-navy-600/10 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-slate-600">
        <Loader2 size={14} className="text-orange-400 animate-spin" />
        Detecting your zone…
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-amber-700">
        <AlertCircle size={14} />
        {error}
        <button onClick={handleDetect} className="ml-auto text-xs font-semibold underline">Retry</button>
      </div>
    );
  }

  if (zone) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-emerald-700">
        <MapPin size={14} className="text-emerald-500" />
        <span>Showing stores near <strong>{zone.name}</strong></span>
        <button
          onClick={() => router.push(`/stores?zone=${zone.id}`)}
          className="ml-auto text-xs font-semibold text-emerald-600 hover:underline"
        >
          Browse →
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDetect}
      className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-orange-600 w-full hover:bg-orange-100 transition"
    >
      <MapPin size={14} className="text-orange-400" />
      <span className="font-semibold">Detect my location for faster delivery</span>
      <span className="ml-auto text-xs">Tap to enable →</span>
    </button>
  );
}
