"use client";
import { useState } from "react";
import {
  Megaphone, Eye, MousePointerClick, ShoppingBag, CheckCircle,
  Zap, Bell, Star, Home, Tag, Search, MapPin, TruckIcon, Plus, Info,
} from "lucide-react";
import { adsByVendor, pushCampaigns } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import { ZONES } from "@/lib/zones";
import type { AdPlacementType } from "@/lib/types";

const DEMO_VENDOR_ID = "v-burhan";

interface AdPackage {
  type: AdPlacementType;
  icon: React.ReactNode;
  title: string;
  description: string;
  price_label: string;
  price_fils: number;
  highlight?: boolean;
}

const AD_PACKAGES: AdPackage[] = [
  {
    type: "homepage_banner",
    icon: <Home size={20} />,
    title: "Homepage Banner",
    description: "Full-width banner on the customer homepage. Highest visibility.",
    price_label: "50 BHD / month",
    price_fils: 50_000,
    highlight: true,
  },
  {
    type: "sponsored_vendor",
    icon: <Star size={20} />,
    title: "Sponsored Listing",
    description: "Appear at the top of search results and category pages. Marked 'Sponsored'.",
    price_label: "15 BHD / week",
    price_fils: 15_000,
    highlight: true,
  },
  {
    type: "zone_takeover",
    icon: <MapPin size={20} />,
    title: "Zone Takeover",
    description: "Dominate one delivery zone for a limited time. Max 1 vendor per zone.",
    price_label: "25 BHD / week",
    price_fils: 25_000,
  },
  {
    type: "push_notification",
    icon: <Bell size={20} />,
    title: "Push Notification Blast",
    description: "Send a promotional push notification to customers in selected zones.",
    price_label: "30 BHD / blast",
    price_fils: 30_000,
  },
  {
    type: "category_banner",
    icon: <Tag size={20} />,
    title: "Category Banner",
    description: "Banner displayed inside a category page (e.g. African Food).",
    price_label: "20 BHD / month",
    price_fils: 20_000,
  },
  {
    type: "search_keyword",
    icon: <Search size={20} />,
    title: "Search Keyword Ad",
    description: "Appear when customers search specific keywords. You pay per click.",
    price_label: "0.050 BHD / click",
    price_fils: 50,
  },
  {
    type: "sponsored_product",
    icon: <Tag size={20} />,
    title: "Sponsored Product",
    description: "Boost a specific product to appear at the top of search results.",
    price_label: "10 BHD / week",
    price_fils: 10_000,
  },
  {
    type: "driver_bag",
    icon: <TruckIcon size={20} />,
    title: "Driver Bag / Uniform Ad",
    description: "Place your brand logo on Impact Market driver bags and uniforms.",
    price_label: "80 BHD / month",
    price_fils: 80_000,
  },
];

interface PushForm {
  title: string;
  body: string;
  zone_ids: string[];
  schedule_at: string;
}

const BLANK_PUSH: PushForm = { title: "", body: "", zone_ids: [], schedule_at: "" };

export default function VendorAdvertisingPage() {
  const myAds   = adsByVendor(DEMO_VENDOR_ID);
  const myPush  = pushCampaigns.filter((p) => p.vendor_id === DEMO_VENDOR_ID);

  const [purchased, setPurchased]     = useState<AdPlacementType | null>(null);
  const [confirmPkg, setConfirmPkg]   = useState<AdPackage | null>(null);
  const [showPush, setShowPush]       = useState(false);
  const [pushForm, setPushForm]       = useState<PushForm>(BLANK_PUSH);
  const [pushSent, setPushSent]       = useState(false);

  const totalSpent      = myAds.reduce((s, a) => s + a.spent_fils, 0);
  const totalImpr       = myAds.reduce((s, a) => s + a.impressions, 0);
  const totalClicks     = myAds.reduce((s, a) => s + a.clicks, 0);
  const totalConversions = myAds.reduce((s, a) => s + a.conversions, 0);
  const roas            = totalSpent > 0 ? (totalConversions * 8_000 / totalSpent).toFixed(1) : "—";

  function buyPackage(pkg: AdPackage) {
    setConfirmPkg(null);
    setPurchased(pkg.type);
    setTimeout(() => setPurchased(null), 3000);
  }

  function toggleZone(id: string) {
    setPushForm((prev) => ({
      ...prev,
      zone_ids: prev.zone_ids.includes(id)
        ? prev.zone_ids.filter((z) => z !== id)
        : [...prev.zone_ids, id],
    }));
  }

  function submitPush() {
    if (!pushForm.title || !pushForm.body || !pushForm.schedule_at) return;
    setPushSent(true);
    setShowPush(false);
    setPushForm(BLANK_PUSH);
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-black text-ink flex items-center gap-2">
          <Megaphone size={20} className="text-orange-500" /> Advertising & Promotions
        </h2>
        <p className="text-sm text-slate-500 mt-1">Boost your visibility and reach more customers across Bahrain.</p>
      </div>

      {pushSent && (
        <div className="card p-4 bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700 font-semibold">Push notification campaign submitted for review!</p>
        </div>
      )}

      {purchased && (
        <div className="card p-4 bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <CheckCircle size={18} className="text-emerald-500 shrink-0" />
          <p className="text-sm text-emerald-700 font-semibold">Ad placement purchased! Our team will activate it within 24 hours.</p>
        </div>
      )}

      {/* ── My Campaign Stats ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Spent",   value: fmtBHD(totalSpent),              color: "text-orange-500" },
          { label: "Impressions",   value: totalImpr.toLocaleString(),       color: "text-blue-600" },
          { label: "Clicks",        value: totalClicks.toLocaleString(),     color: "text-ink" },
          { label: "ROAS",          value: `${roas}×`,                       color: "text-emerald-600" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className={`stat-value text-xl ${s.color}`}>{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Ad Packages ────────────────────────────────────────── */}
      <section className="space-y-4">
        <h3 className="font-bold text-ink">Available Ad Placements</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {AD_PACKAGES.map((pkg) => (
            <div
              key={pkg.type}
              className={`card p-5 flex flex-col gap-3 ${pkg.highlight ? "border-2 border-orange-200 bg-orange-50/30" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${pkg.highlight ? "bg-orange-100 text-orange-500" : "bg-slate-100 text-slate-500"}`}>
                  {pkg.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink text-sm">{pkg.title}</p>
                    {pkg.highlight && <Zap size={12} className="text-orange-400" />}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <span className="text-sm font-black text-orange-500">{pkg.price_label}</span>
                <button
                  onClick={() => {
                    if (pkg.type === "push_notification") { setShowPush(true); }
                    else { setConfirmPkg(pkg); }
                  }}
                  className="btn-primary btn-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Confirm Modal ──────────────────────────────────────── */}
      {confirmPkg && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
            <p className="font-black text-ink text-lg">Confirm Purchase</p>
            <p className="text-sm text-slate-600">
              You are buying <strong>{confirmPkg.title}</strong> for{" "}
              <strong className="text-orange-500">{confirmPkg.price_label}</strong>.
            </p>
            <p className="text-xs text-slate-400 flex items-start gap-1.5">
              <Info size={12} className="mt-0.5 shrink-0" />
              Payment will be deducted from your wallet or charged to your registered payment method. Ads go live within 24 hours after admin review.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmPkg(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={() => buyPackage(confirmPkg)} className="btn-primary flex-1">Confirm & Pay</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Push Notification Form ─────────────────────────────── */}
      {showPush && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-lg w-full space-y-5">
            <p className="font-black text-ink text-lg flex items-center gap-2">
              <Bell size={18} className="text-orange-500" /> Create Push Campaign
            </p>
            <div className="form-group">
              <label className="label">Notification Title *</label>
              <input
                className="input"
                placeholder="e.g. 🔥 Weekend Special — 20% Off!"
                value={pushForm.title}
                onChange={(e) => setPushForm({ ...pushForm, title: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="label">Message Body *</label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Describe the promotion…"
                value={pushForm.body}
                onChange={(e) => setPushForm({ ...pushForm, body: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1">{pushForm.body.length}/160 characters</p>
            </div>
            <div className="form-group">
              <label className="label">Target Zones (leave empty = all Bahrain)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {ZONES.filter((z) => z.is_active).map((z) => (
                  <button
                    key={z.id}
                    onClick={() => toggleZone(z.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      pushForm.zone_ids.includes(z.id)
                        ? "bg-orange-500 text-white border-orange-500"
                        : "border-slate-200 text-slate-600 hover:border-orange-300"
                    }`}
                  >
                    {z.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="label">Schedule Date & Time *</label>
              <input
                type="datetime-local"
                className="input"
                value={pushForm.schedule_at}
                onChange={(e) => setPushForm({ ...pushForm, schedule_at: e.target.value })}
              />
            </div>
            <div className="flex items-center justify-between text-sm text-slate-500 border-t pt-3">
              <span>Campaign Price:</span>
              <span className="font-black text-orange-500">30.000 BHD</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowPush(false)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={submitPush} className="btn-primary flex-1">Submit for Review</button>
            </div>
          </div>
        </div>
      )}

      {/* ── My Active Campaigns ────────────────────────────────── */}
      {myAds.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold text-ink">My Campaigns</h3>
          <div className="space-y-3">
            {myAds.map((ad) => {
              const ctr = ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "—";
              const cvr = ad.clicks ? ((ad.conversions / ad.clicks) * 100).toFixed(1) : "—";
              const progress = ad.budget_fils > 0 ? Math.min(100, (ad.spent_fils / ad.budget_fils) * 100) : 0;
              return (
                <div key={ad.id} className={`card p-4 border-l-4 ${ad.status === "active" ? "border-l-emerald-400" : "border-l-slate-200"}`}>
                  <div className="flex items-start gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ad.image_url} alt="" className="h-12 w-20 rounded-lg object-cover bg-slate-100 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-ink text-sm">{ad.title}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ad.status === "active" ? "bg-emerald-100 text-emerald-700" :
                          ad.status === "paused" ? "bg-slate-100 text-slate-500" :
                          "bg-amber-100 text-amber-700"
                        }`}>{ad.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{ad.start_date} → {ad.end_date}</p>

                      {/* Budget progress */}
                      <div className="mt-2">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                          <span>Budget: {fmtBHD(ad.spent_fils)} / {fmtBHD(ad.budget_fils)}</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="flex items-center gap-1 text-slate-500"><Eye size={10} />{ad.impressions.toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-slate-500"><MousePointerClick size={10} />{ad.clicks} <span className="text-slate-400">({ctr}%)</span></span>
                        <span className="flex items-center gap-1 text-emerald-600 font-semibold"><ShoppingBag size={10} />{ad.conversions} orders <span className="text-slate-400">({cvr}%)</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── My Push Campaigns ──────────────────────────────────── */}
      {myPush.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-bold text-ink">My Push Campaigns</h3>
          <div className="space-y-3">
            {myPush.map((pc) => (
              <div key={pc.id} className="card p-4 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
                  <Bell size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-ink text-sm">{pc.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{pc.body}</p>
                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span>Reach: {pc.reach.toLocaleString()}</span>
                    {pc.open_rate_pct > 0 && <span>Open rate: <strong className="text-ink">{pc.open_rate_pct}%</strong></span>}
                    <span className={`font-semibold ${
                      pc.status === "sent" ? "text-emerald-600" :
                      pc.status === "scheduled" ? "text-blue-600" : "text-slate-400"
                    }`}>{pc.status}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 shrink-0">{relTime(pc.schedule_at)}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
