"use client";
import { useState } from "react";
import { Settings, Save, AlertTriangle } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/lib/profit-calc";
import { fmtBHD } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const fields: { label: string; key: keyof typeof settings; type: "number" | "boolean"; unit?: string }[] = [
    { label: "Default Commission %", key: "default_commission_pct", type: "number", unit: "%" },
    { label: "Service Fee (fils)", key: "service_fee_fils", type: "number", unit: "fils" },
    { label: "Same-Zone Delivery (fils)", key: "same_zone_delivery_fils", type: "number", unit: "fils" },
    { label: "Near-Zone Delivery (< 5km) (fils)", key: "near_zone_delivery_fils", type: "number", unit: "fils" },
    { label: "Mid-Zone Delivery (5–10km) (fils)", key: "mid_zone_delivery_fils", type: "number", unit: "fils" },
    { label: "Far-Zone Delivery (> 10km) (fils)", key: "far_zone_delivery_fils", type: "number", unit: "fils" },
    { label: "Driver Payout per Delivery (fils)", key: "driver_payout_fils", type: "number", unit: "fils" },
    { label: "Free Delivery Threshold (fils, 0=off)", key: "free_delivery_min_order_fils", type: "number", unit: "fils" },
    { label: "Cash on Delivery", key: "cod_enabled", type: "boolean" },
    { label: "Online Payment", key: "online_payment_enabled", type: "boolean" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink flex items-center gap-2">
          <Settings size={20} /> Platform Settings
        </h2>
        <button onClick={save} className="btn-primary">
          <Save size={14} /> {saved ? "Saved ✓" : "Save"}
        </button>
      </div>

      <div className="card divide-y divide-slate-100">
        {fields.map((f) => (
          <div key={f.key} className="flex items-center justify-between px-5 py-4">
            <label className="text-sm font-semibold text-slate-700">{f.label}
              {f.type === "number" && f.unit === "fils" && (
                <span className="ml-2 text-xs text-slate-400 font-normal">
                  = {fmtBHD(settings[f.key] as number)}
                </span>
              )}
            </label>
            {f.type === "boolean" ? (
              <button
                onClick={() => setSettings((s) => ({ ...s, [f.key]: !s[f.key] }))}
                className={`relative inline-flex h-6 w-11 rounded-full transition ${settings[f.key] ? "bg-emerald-500" : "bg-slate-300"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition transform mt-0.5 ${settings[f.key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            ) : (
              <input
                type="number"
                className="input w-32 text-right text-sm py-1.5"
                value={settings[f.key] as number}
                onChange={(e) => setSettings((s) => ({ ...s, [f.key]: Number(e.target.value) }))}
              />
            )}
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="card border-red-100 p-5">
        <h3 className="font-bold text-red-600 flex items-center gap-2 mb-3">
          <AlertTriangle size={16} /> Danger Zone
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-ink text-sm">Pause Marketplace</p>
            <p className="text-xs text-slate-500 mt-0.5">Stops all new orders. Existing orders continue.</p>
          </div>
          <button
            onClick={() => setSettings((s) => ({ ...s, platform_paused: !s.platform_paused }))}
            className={settings.platform_paused ? "btn-primary bg-emerald-500 hover:bg-emerald-600" : "btn-danger"}
          >
            {settings.platform_paused ? "Resume" : "Pause Platform"}
          </button>
        </div>
      </div>
    </div>
  );
}
