"use client";
import { useState } from "react";
import {
  Megaphone, TrendingUp, MousePointerClick, Eye, ShoppingBag,
  DollarSign, ToggleLeft, ToggleRight, CheckCircle, XCircle,
  Plus, Filter, ExternalLink,
} from "lucide-react";
import { ads as initAds, pushCampaigns, vendors } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import type { Ad, AdStatus, AdPlacementType } from "@/lib/types";

const PLACEMENT_LABELS: Record<AdPlacementType, string> = {
  homepage_banner:    "Homepage Banner",
  category_banner:    "Category Banner",
  sponsored_vendor:   "Sponsored Vendor",
  sponsored_product:  "Sponsored Product",
  search_keyword:     "Search Keyword",
  zone_takeover:      "Zone Takeover",
  push_notification:  "Push Notification",
  driver_bag:         "Driver Bag / Uniform",
};

const PLACEMENT_PRICES: Record<AdPlacementType, { label: string; fils: number }> = {
  homepage_banner:   { label: "50 BHD / month",  fils: 50_000 },
  category_banner:   { label: "20 BHD / month",  fils: 20_000 },
  sponsored_vendor:  { label: "15 BHD / week",   fils: 15_000 },
  sponsored_product: { label: "10 BHD / week",   fils: 10_000 },
  search_keyword:    { label: "0.050 BHD / click", fils: 50 },
  zone_takeover:     { label: "25 BHD / week",   fils: 25_000 },
  push_notification: { label: "30 BHD / blast",  fils: 30_000 },
  driver_bag:        { label: "80 BHD / month",  fils: 80_000 },
};

const STATUS_BADGE: Record<AdStatus, string> = {
  pending:  "bg-amber-100 text-amber-700",
  active:   "bg-emerald-100 text-emerald-700",
  paused:   "bg-slate-100 text-slate-500",
  rejected: "bg-red-100 text-red-600",
  expired:  "bg-purple-100 text-purple-600",
};

export default function AdminAdvertisingPage() {
  const [adList, setAdList]     = useState<Ad[]>(initAds);
  const [filter, setFilter]     = useState<AdStatus | "all">("all");
  const [showPricing, setShowPricing] = useState(false);

  const shown = filter === "all" ? adList : adList.filter((a) => a.status === filter);

  const totalRevenue     = adList.reduce((s, a) => s + a.spent_fils, 0);
  const totalImpressions = adList.reduce((s, a) => s + a.impressions, 0);
  const totalClicks      = adList.reduce((s, a) => s + a.clicks, 0);
  const totalConversions = adList.reduce((s, a) => s + a.conversions, 0);
  const avgCtr           = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0";

  function setStatus(id: string, status: AdStatus) {
    setAdList((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-ink flex items-center gap-2">
          <Megaphone size={20} className="text-orange-500" /> Advertising Dashboard
        </h2>
        <button onClick={() => setShowPricing(!showPricing)} className="btn-ghost btn-sm">
          {showPricing ? "Hide" : "View"} Pricing
        </button>
      </div>

      {/* ── KPI Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ad Revenue",      value: fmtBHD(totalRevenue),         icon: <DollarSign  size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Impressions",     value: totalImpressions.toLocaleString(), icon: <Eye         size={18} />, color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Clicks",          value: totalClicks.toLocaleString(),  icon: <MousePointerClick size={18}/>, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Conversions",     value: totalConversions.toLocaleString(), icon: <ShoppingBag size={18} />, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="stat-card flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}>{s.icon}</div>
            <div>
              <p className={`stat-value text-xl ${s.color}`}>{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Avg CTR */}
      <div className="card p-4 flex items-center gap-4">
        <TrendingUp size={20} className="text-orange-400" />
        <div>
          <p className="text-xs text-slate-500">Average CTR (Click-Through Rate)</p>
          <p className="text-2xl font-black text-ink">{avgCtr}%</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-slate-500">Active campaigns</p>
          <p className="text-2xl font-black text-orange-500">{adList.filter((a) => a.status === "active").length}</p>
        </div>
      </div>

      {/* ── Pricing Table ──────────────────────────────────────── */}
      {showPricing && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink">Ad Placement Pricing</div>
          <div className="divide-y divide-slate-100">
            {(Object.entries(PLACEMENT_LABELS) as [AdPlacementType, string][]).map(([type, label]) => (
              <div key={type} className="flex items-center justify-between px-5 py-3 text-sm">
                <span className="font-semibold text-ink">{label}</span>
                <span className="text-slate-500">{PLACEMENT_PRICES[type].label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Filter + Campaign List ─────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-slate-400" />
          {(["all", "pending", "active", "paused", "rejected", "expired"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition border ${
                filter === s ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-600 hover:border-orange-300"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="ml-1 opacity-70">({adList.filter((a) => a.status === s).length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ad / Advertiser</th>
                  <th>Placement</th>
                  <th>Status</th>
                  <th>Dates</th>
                  <th className="text-right">Spent</th>
                  <th className="text-right">Impr.</th>
                  <th className="text-right">Clicks</th>
                  <th className="text-right">CVR</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((ad) => {
                  const ctr = ad.impressions ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "—";
                  const cvr = ad.clicks ? ((ad.conversions / ad.clicks) * 100).toFixed(1) : "—";
                  return (
                    <tr key={ad.id}>
                      <td>
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ad.image_url} alt="" className="h-9 w-14 rounded-lg object-cover bg-slate-100 shrink-0" />
                          <div>
                            <p className="font-semibold text-ink text-xs leading-tight">{ad.title}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{ad.advertiser_name}</p>
                            <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${ad.advertiser_type === "vendor" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                              {ad.advertiser_type}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                          {PLACEMENT_LABELS[ad.placement_type]}
                        </span>
                      </td>
                      <td>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_BADGE[ad.status]}`}>
                          {ad.status}
                        </span>
                      </td>
                      <td className="text-[10px] text-slate-400">
                        {ad.start_date}<br />{ad.end_date}
                      </td>
                      <td className="text-right text-xs font-bold text-emerald-600">{fmtBHD(ad.spent_fils)}</td>
                      <td className="text-right text-xs">{ad.impressions.toLocaleString()}</td>
                      <td className="text-right text-xs">
                        {ad.clicks.toLocaleString()}
                        <span className="text-slate-400 ml-1">({ctr}%)</span>
                      </td>
                      <td className="text-right text-xs">
                        {ad.conversions}
                        <span className="text-slate-400 ml-1">({cvr}%)</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          {ad.status === "pending" && (
                            <>
                              <button onClick={() => setStatus(ad.id, "active")} className="text-emerald-500 hover:text-emerald-700 transition" title="Approve">
                                <CheckCircle size={15} />
                              </button>
                              <button onClick={() => setStatus(ad.id, "rejected")} className="text-red-400 hover:text-red-600 transition" title="Reject">
                                <XCircle size={15} />
                              </button>
                            </>
                          )}
                          {ad.status === "active" && (
                            <button onClick={() => setStatus(ad.id, "paused")} className="text-slate-400 hover:text-amber-500 transition" title="Pause">
                              <ToggleRight size={18} />
                            </button>
                          )}
                          {ad.status === "paused" && (
                            <button onClick={() => setStatus(ad.id, "active")} className="text-slate-400 hover:text-emerald-500 transition" title="Resume">
                              <ToggleLeft size={18} />
                            </button>
                          )}
                          <a href={ad.target_url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition">
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Push Notification Campaigns ───────────────────────── */}
      <section className="space-y-3">
        <h3 className="font-bold text-ink flex items-center gap-2">
          <Plus size={15} className="text-orange-400" /> Push Notification Campaigns
        </h3>
        <div className="card overflow-hidden">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Reach</th>
                  <th>Open Rate</th>
                  <th>Price</th>
                  <th>Scheduled</th>
                </tr>
              </thead>
              <tbody>
                {pushCampaigns.map((pc) => (
                  <tr key={pc.id}>
                    <td className="text-sm font-semibold text-ink">{pc.vendor_name}</td>
                    <td className="text-sm max-w-xs truncate">{pc.title}</td>
                    <td>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pc.status === "sent"      ? "bg-emerald-100 text-emerald-700" :
                        pc.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                        pc.status === "draft"     ? "bg-slate-100 text-slate-500" :
                                                    "bg-red-100 text-red-600"
                      }`}>
                        {pc.status}
                      </span>
                    </td>
                    <td className="text-sm">{pc.reach.toLocaleString()}</td>
                    <td className="text-sm font-semibold">
                      {pc.open_rate_pct > 0 ? `${pc.open_rate_pct}%` : "—"}
                    </td>
                    <td className="text-sm font-bold text-emerald-600">{fmtBHD(pc.price_fils)}</td>
                    <td className="text-xs text-slate-400">{relTime(pc.schedule_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
