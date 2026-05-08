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

  type Field = { label: string; key: keyof typeof settings; type: "number" | "boolean"; unit?: string; group?: string };
  const fields: Field[] = [
    // Commission
    { label: "Food Commission %",         key: "food_commission_pct",          type: "number", unit: "%",    group: "Commission" },
    { label: "Products Commission %",     key: "products_commission_pct",      type: "number", unit: "%",    group: "Commission" },
    { label: "Default Commission % (fallback)", key: "default_commission_pct", type: "number", unit: "%",    group: "Commission" },
    // Fees
    { label: "Service Fee",               key: "service_fee_fils",             type: "number", unit: "fils", group: "Fees" },
    { label: "Minimum Order",             key: "min_order_fils",               type: "number", unit: "fils", group: "Fees" },
    // Client delivery tiers
    { label: "Delivery  0–3 km",          key: "same_zone_delivery_fils",      type: "number", unit: "fils", group: "Client Delivery Fee" },
    { label: "Delivery  3–6 km",          key: "near_zone_delivery_fils",      type: "number", unit: "fils", group: "Client Delivery Fee" },
    { label: "Delivery  6–9 km",          key: "mid_zone_delivery_fils",       type: "number", unit: "fils", group: "Client Delivery Fee" },
    { label: "Delivery  9–12 km",         key: "far_zone_delivery_fils",       type: "number", unit: "fils", group: "Client Delivery Fee" },
    { label: "Delivery  12+ km",          key: "xfar_zone_delivery_fils",      type: "number", unit: "fils", group: "Client Delivery Fee" },
    { label: "Max Delivery Distance (km)", key: "max_delivery_km",             type: "number", unit: "%",    group: "Client Delivery Fee" },
    // Driver pay tiers
    { label: "Driver Pay  0–3 km",        key: "driver_pay_near_fils",         type: "number", unit: "fils", group: "Driver Pay" },
    { label: "Driver Pay  3–6 km",        key: "driver_pay_mid_fils",          type: "number", unit: "fils", group: "Driver Pay" },
    { label: "Driver Pay  6–9 km",        key: "driver_pay_far_fils",          type: "number", unit: "fils", group: "Driver Pay" },
    { label: "Driver Pay  9–12+ km",      key: "driver_pay_xfar_fils",         type: "number", unit: "fils", group: "Driver Pay" },
    // Driver bonuses
    { label: "Bonus Tier 1 (deliveries)", key: "driver_bonus_tier1_deliveries", type: "number", unit: "%",    group: "Driver Bonuses" },
    { label: "Bonus Tier 1 (fils/extra)", key: "driver_bonus_tier1_fils",       type: "number", unit: "fils", group: "Driver Bonuses" },
    { label: "Bonus Tier 2 (deliveries)", key: "driver_bonus_tier2_deliveries", type: "number", unit: "%",    group: "Driver Bonuses" },
    { label: "Bonus Tier 2 (fils/extra)", key: "driver_bonus_tier2_fils",       type: "number", unit: "fils", group: "Driver Bonuses" },
    // Surcharges
    { label: "Rush — Customer surcharge",  key: "rush_surcharge_fils",         type: "number", unit: "fils", group: "Surcharges" },
    { label: "Rush — Driver bonus",        key: "rush_driver_bonus_fils",      type: "number", unit: "fils", group: "Surcharges" },
    { label: "Rain — Customer surcharge",  key: "rain_surcharge_fils",         type: "number", unit: "fils", group: "Surcharges" },
    { label: "Rain — Driver bonus",        key: "rain_driver_bonus_fils",      type: "number", unit: "fils", group: "Surcharges" },
    // Free delivery
    { label: "Free Delivery Threshold (0 = off)", key: "free_delivery_min_order_fils", type: "number", unit: "fils", group: "Free Delivery" },
    { label: "Vendor Shares Delivery Cost",        key: "free_delivery_vendor_shares",  type: "boolean",             group: "Free Delivery" },
    // Toggles
    { label: "Cash on Delivery",          key: "cod_enabled",                  type: "boolean", group: "Toggles" },
    { label: "Online Payment",            key: "online_payment_enabled",       type: "boolean", group: "Toggles" },
  ];

  const groups = [...new Set(fields.map((f) => f.group ?? ""))];


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

      {groups.map((group) => (
        <div key={group} className="card divide-y divide-slate-100">
          <div className="px-5 py-3 bg-slate-50 rounded-t-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{group}</p>
          </div>
          {fields.filter((f) => (f.group ?? "") === group).map((f) => (
            <div key={f.key} className="flex items-center justify-between px-5 py-4">
              <label className="text-sm font-semibold text-slate-700">{f.label}
                {f.type === "number" && f.unit === "fils" && (
                  <span className="ml-2 text-xs text-slate-400 font-normal">
                    = {fmtBHD(settings[f.key] as number)}
                  </span>
                )}
                {f.type === "number" && f.unit === "%" && (
                  <span className="ml-2 text-xs text-slate-400 font-normal">
                    {settings[f.key]}%
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
      ))}

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
