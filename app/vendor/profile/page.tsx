"use client";
import { useState } from "react";
import { Save, Store, Clock, MapPin, Camera } from "lucide-react";
import { vendors, categories } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";

const DEMO_VENDOR_ID = "v-burhan";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function VendorProfilePage() {
  const vendor   = vendors.find((v) => v.id === DEMO_VENDOR_ID)!;
  const category = categories.find((c) => c.id === vendor.category_id);

  const [form, setForm] = useState({
    business_name:           vendor.business_name,
    owner_name:              vendor.owner_name,
    phone:                   vendor.phone,
    email:                   vendor.email,
    cr_number:               vendor.cr_number ?? "",
    address:                 vendor.address,
    category_id:             vendor.category_id,
    zone_id:                 vendor.zone_id,
    delivery_radius_km:      vendor.delivery_radius_km,
    preparation_time_minutes: vendor.preparation_time_minutes,
    opening_open:            vendor.opening_hours.open,
    opening_close:           vendor.opening_hours.close,
    opening_days:            vendor.opening_hours.days as number[],
    logo_url:                vendor.logo_url,
    cover_url:               vendor.cover_url,
  });
  const [saved, setSaved] = useState(false);

  function toggleDay(d: number) {
    setForm((prev) => ({
      ...prev,
      opening_days: prev.opening_days.includes(d)
        ? prev.opening_days.filter((x) => x !== d)
        : [...prev.opening_days, d].sort(),
    }));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-ink">Business Profile</h2>
        <button onClick={save} className="btn-primary">
          <Save size={14} /> {saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {/* Cover & logo preview */}
      <div className="card overflow-hidden">
        <div className="relative h-32 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.cover_url} alt="Cover" className="w-full h-full object-cover" />
          <button className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-black/70 transition">
            <Camera size={11} /> Change Cover
          </button>
        </div>
        <div className="px-5 pb-5 flex items-end gap-4 -mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={form.logo_url} alt="Logo" className="h-16 w-16 rounded-xl object-cover border-4 border-white shadow" />
          <button className="btn-ghost btn-sm mb-1"><Camera size={12} /> Change Logo</button>
        </div>
      </div>

      {/* Business info */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Store size={15} className="text-orange-500" />
          <p className="font-bold text-ink">Business Information</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Business Name *</label>
            <input className="input" value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Owner Name *</label>
            <input className="input" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Phone</label>
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">CR / License Number</label>
            <input className="input" placeholder="Optional" value={form.cr_number} onChange={(e) => setForm({ ...form, cr_number: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Category</label>
            <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group sm:col-span-2">
            <label className="label">Street Address</label>
            <input className="input" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Location & delivery */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <MapPin size={15} className="text-orange-500" />
          <p className="font-bold text-ink">Location & Delivery</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Delivery Zone</label>
            <select className="input" value={form.zone_id} onChange={(e) => setForm({ ...form, zone_id: e.target.value })}>
              {ZONES.filter((z) => z.is_active).map((z) => (
                <option key={z.id} value={z.id}>{z.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label">Delivery Radius (km)</label>
            <input
              type="number" min={1} max={20}
              className="input"
              value={form.delivery_radius_km}
              onChange={(e) => setForm({ ...form, delivery_radius_km: Number(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label className="label">Preparation Time (minutes)</label>
            <input
              type="number" min={5} max={120}
              className="input"
              value={form.preparation_time_minutes}
              onChange={(e) => setForm({ ...form, preparation_time_minutes: Number(e.target.value) })}
            />
            <p className="text-xs text-slate-400 mt-1">Affects your ranking score — faster = higher position</p>
          </div>
        </div>
      </div>

      {/* Opening hours */}
      <div className="card p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock size={15} className="text-orange-500" />
          <p className="font-bold text-ink">Opening Hours</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="label">Opening Time</label>
            <input type="time" className="input" value={form.opening_open} onChange={(e) => setForm({ ...form, opening_open: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="label">Closing Time</label>
            <input type="time" className="input" value={form.opening_close} onChange={(e) => setForm({ ...form, opening_close: e.target.value })} />
          </div>
        </div>

        <div>
          <p className="label mb-2">Open Days</p>
          <div className="flex gap-2 flex-wrap">
            {DAYS.map((day, i) => (
              <button
                key={day}
                onClick={() => toggleDay(i)}
                className={`h-9 w-12 rounded-lg text-xs font-bold transition border ${
                  form.opening_days.includes(i)
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-slate-200 text-slate-500 hover:border-orange-300"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Read-only commission info */}
      <div className="card p-4 bg-slate-50 border border-slate-200">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="font-bold text-ink">Current Commission Rate</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Set by your subscription plan and category.
              To reduce your rate, upgrade to Growth or Premium.
            </p>
          </div>
          <span className="text-2xl font-black text-orange-500">{vendor.commission_pct}%</span>
        </div>
      </div>
    </div>
  );
}
