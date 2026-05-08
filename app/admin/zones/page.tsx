"use client";
import { useState } from "react";
import { MapPin, Plus, Edit2, ToggleLeft, ToggleRight } from "lucide-react";
import BahrainZoneMap from "@/components/map/bahrain-zone-map";
import { ZONES } from "@/lib/zones";
import { fmtBHD } from "@/lib/utils";

export default function AdminZonesPage() {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [zones, setZones] = useState(ZONES);

  const activeZone = zones.find((z) => z.id === activeZoneId);

  function toggleZone(id: string) {
    setZones((prev) => prev.map((z) => z.id === id ? { ...z, is_active: !z.is_active } : z));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-ink">Zone Management</h2>
          <p className="text-sm text-slate-500 mt-0.5">{zones.filter((z) => z.is_active).length} active zones across Bahrain</p>
        </div>
        <button className="btn-primary"><Plus size={15} /> Add Zone</button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Map */}
        <div className="xl:col-span-2">
          <BahrainZoneMap
            activeZoneId={activeZoneId}
            onZoneClick={(id) => setActiveZoneId((prev) => prev === id ? null : id)}
            height={520}
          />
          <p className="text-xs text-slate-400 mt-2 text-center">Click a zone to select it and view details</p>
        </div>

        {/* Zone list / detail */}
        <div className="card overflow-hidden">
          {activeZone ? (
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink text-lg flex items-center gap-2">
                  <MapPin size={16} className="text-orange-400" /> {activeZone.name}
                </h3>
                <button className="btn-ghost btn-sm"><Edit2 size={13} /></button>
              </div>
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "Slug", value: activeZone.slug },
                  { label: "Areas", value: activeZone.cities.join(", ") },
                  { label: "Base Delivery Fee", value: fmtBHD(activeZone.base_delivery_fee_fils) },
                  { label: "Min Order", value: fmtBHD(activeZone.min_order_fils) },
                  { label: "Est. Delivery Time", value: `${activeZone.estimated_delivery_min} min` },
                  { label: "Centroid", value: `${activeZone.centroid.lat.toFixed(4)}, ${activeZone.centroid.lng.toFixed(4)}` },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-slate-500">{r.label}</span>
                    <span className="font-semibold text-ink text-right max-w-[55%]">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm font-semibold text-slate-600">Active</span>
                <button onClick={() => toggleZone(activeZone.id)} className={`flex items-center gap-1.5 text-sm font-semibold transition ${activeZone.is_active ? "text-emerald-600" : "text-slate-400"}`}>
                  {activeZone.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  {activeZone.is_active ? "On" : "Off"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">
                All Zones ({zones.length})
              </div>
              <div className="overflow-y-auto max-h-[480px] divide-y divide-slate-100">
                {zones.map((z) => (
                  <div
                    key={z.id}
                    onClick={() => setActiveZoneId(z.id)}
                    className="flex items-center justify-between px-5 py-3 hover:bg-orange-50/60 cursor-pointer transition"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{z.name}</p>
                      <p className="text-xs text-slate-400">{z.cities.slice(0, 2).join(", ")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{fmtBHD(z.base_delivery_fee_fils)}</span>
                      <span className={`h-2 w-2 rounded-full ${z.is_active ? "bg-emerald-400" : "bg-slate-300"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
