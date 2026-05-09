"use client";
import { useState } from "react";
import { BarChart2, DollarSign, ShoppingBag, Star, Clock, TrendingUp, Eye } from "lucide-react";
import { ordersByVendor, vendorById, productsByVendor, ads, categories } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";
import { fmtBHD } from "@/lib/utils";

const DEMO_VENDOR_ID = "v-burhan";

// ─── SVG Micro-charts ─────────────────────────────────────────────────────────

function BarChart({ data, color = "#f97316" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 320, H = 100, BAR = Math.floor((W / data.length) * 0.55);
  const gap = (W - BAR * data.length) / (data.length + 1);
  return (
    <svg viewBox={`0 0 ${W} ${H + 20}`} className="w-full">
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * H);
        const x = gap + i * (BAR + gap);
        return (
          <g key={i}>
            <rect x={x} y={H - barH} width={BAR} height={barH} rx={3} fill={color} opacity={0.85} />
            <text x={x + BAR / 2} y={H + 13} textAnchor="middle" fontSize={8} fill="#94a3b8">{d.label}</text>
            {d.value > 0 && (
              <text x={x + BAR / 2} y={H - barH - 4} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">{d.value}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function SparkLine({ data, color = "#10b981" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  const W = 100, H = 28;
  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const ys = data.map((v) => H - (v / max) * (H - 4));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-24 h-7">
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const HOURS = ["8am","9am","10am","11am","12pm","1pm","2pm","3pm","4pm","5pm","6pm","7pm","8pm","9pm","10pm"];
const DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const peakHours = [2, 3, 5, 8, 12, 14, 11, 9, 10, 13, 15, 12, 9, 7, 4];
const weekOrders = [4, 6, 5, 8, 11, 14, 9];

export default function VendorAnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const vendor  = vendorById(DEMO_VENDOR_ID)!;
  const myOrders = ordersByVendor(DEMO_VENDOR_ID);
  const myProducts = productsByVendor(DEMO_VENDOR_ID);
  const myAds    = ads.filter((a) => a.advertiser_id === DEMO_VENDOR_ID);

  const paidOrders   = myOrders.filter((o) => o.payment_status === "paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + o.vendor_net_fils, 0);
  const totalGMV     = paidOrders.reduce((s, o) => s + o.subtotal_fils, 0);
  const totalComm    = paidOrders.reduce((s, o) => s + o.commission_fils, 0);
  const avgOrder     = paidOrders.length ? totalGMV / paidOrders.length : 0;

  // Zone breakdown
  const zoneBreakdown = ZONES.filter((z) => z.is_active).map((z) => ({
    zone: z.name,
    count: myOrders.filter((o) => o.customer_zone_id === z.id).length,
  })).filter((z) => z.count > 0).sort((a, b) => b.count - a.count);

  // Top products by order frequency
  const productFreq = myOrders.flatMap((o) => o.items).reduce<Record<string, { name: string; count: number; revenue: number }>>((acc, item) => {
    if (!acc[item.product_id]) acc[item.product_id] = { name: item.name, count: 0, revenue: 0 };
    acc[item.product_id].count += item.quantity;
    acc[item.product_id].revenue += item.price_fils * item.quantity;
    return acc;
  }, {});
  const topProducts = Object.values(productFreq).sort((a, b) => b.count - a.count).slice(0, 5);

  const totalImpr = myAds.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = myAds.reduce((s, a) => s + a.clicks, 0);
  const totalConversions = myAds.reduce((s, a) => s + a.conversions, 0);

  const chartData = period === "week"
    ? DAYS.map((l, i) => ({ label: l, value: weekOrders[i] }))
    : DAYS.map((l, i) => ({ label: l, value: weekOrders[i] * 4 + Math.floor(Math.random() * 3) }));

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-ink flex items-center gap-2">
          <BarChart2 size={20} className="text-orange-500" /> Store Analytics
        </h2>
        <div className="flex gap-1.5">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                period === p ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-600"
              }`}
            >
              This {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Net Earnings",  value: fmtBHD(totalRevenue),   icon: <DollarSign size={18} />,  color: "text-emerald-600", bg: "bg-emerald-50", spark: [20,30,22,40,38,52,48] },
          { label: "Total Orders",  value: paidOrders.length,       icon: <ShoppingBag size={18} />, color: "text-orange-500",  bg: "bg-orange-50",  spark: [4,6,5,8,7,9,11] },
          { label: "Avg Order",     value: fmtBHD(avgOrder),        icon: <TrendingUp size={18} />,  color: "text-blue-600",    bg: "bg-blue-50",    spark: [5,5,6,6,7,7,8] },
          { label: "Rating",        value: `${vendor.rating} ★`,    icon: <Star size={18} />,        color: "text-amber-500",   bg: "bg-amber-50",   spark: [4,4,4,5,5,5,5] },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}>{s.icon}</div>
              <SparkLine data={s.spark} color={s.color.replace("text-", "#").replace("-600","").replace("-500","").replace("-400","")} />
            </div>
            <p className={`text-2xl font-black mt-2 ${s.color}`}>{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Commission taken */}
      <div className="card p-4 flex items-center gap-4 bg-amber-50 border border-amber-200">
        <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
          <DollarSign size={18} />
        </div>
        <div>
          <p className="text-xs text-amber-700 font-semibold">Platform Commission Deducted</p>
          <p className="text-xl font-black text-amber-700">{fmtBHD(totalComm)}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-amber-600">Rate: {vendor.commission_pct}%</p>
          <p className="text-xs text-amber-500">({vendor.subscription_plan} plan)</p>
        </div>
      </div>

      {/* ── Orders Chart ──────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="font-bold text-ink mb-1">Orders This {period === "week" ? "Week" : "Month"}</p>
          <p className="text-xs text-slate-500 mb-4">Daily order volume</p>
          <BarChart data={chartData} color="#f97316" />
        </div>

        <div className="card p-5">
          <p className="font-bold text-ink mb-1">Peak Hours</p>
          <p className="text-xs text-slate-500 mb-4">When customers order most</p>
          <BarChart
            data={HOURS.map((l, i) => ({ label: l, value: peakHours[i] }))}
            color="#8b5cf6"
          />
          <p className="text-xs text-slate-500 mt-2 text-center">
            Peak: <strong className="text-ink">12pm – 2pm</strong> · Consider more prep staff during this window.
          </p>
        </div>
      </div>

      {/* ── Top Products ──────────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink">Top Products</div>
        <div className="divide-y divide-slate-100">
          {topProducts.map((p, i) => {
            const maxCount = topProducts[0].count;
            return (
              <div key={p.name} className="flex items-center gap-4 px-5 py-3">
                <span className="text-slate-400 font-bold w-5 text-sm">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{p.name}</p>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                    <div className="h-full rounded-full bg-orange-400" style={{ width: `${(p.count / maxCount) * 100}%` }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-ink">{p.count} sold</p>
                  <p className="text-xs text-emerald-600">{fmtBHD(p.revenue)}</p>
                </div>
              </div>
            );
          })}
          {topProducts.length === 0 && (
            <p className="px-5 py-6 text-slate-400 text-sm text-center">No order data yet.</p>
          )}
        </div>
      </div>

      {/* ── Customer Zones ────────────────────────────────────── */}
      <div className="card p-5">
        <p className="font-bold text-ink mb-4">Orders by Customer Zone</p>
        {zoneBreakdown.length > 0 ? (
          <div className="space-y-3">
            {zoneBreakdown.map((z, i) => {
              const maxCount = zoneBreakdown[0].count;
              return (
                <div key={z.zone} className="flex items-center gap-3 text-sm">
                  <span className="w-5 text-slate-400 font-bold text-xs">{i + 1}</span>
                  <span className="w-24 text-slate-600 truncate">{z.zone}</span>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-400" style={{ width: `${(z.count / maxCount) * 100}%` }} />
                  </div>
                  <span className="font-bold text-ink w-6 text-right">{z.count}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-400 text-sm text-center py-4">No zone data yet.</p>
        )}
      </div>

      {/* ── Ad Performance ────────────────────────────────────── */}
      {myAds.length > 0 && (
        <div className="card p-5">
          <p className="font-bold text-ink mb-4 flex items-center gap-2">
            <Eye size={15} className="text-orange-400" /> Ad Performance
          </p>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Impressions", value: totalImpr.toLocaleString(),       color: "text-blue-600" },
              { label: "Clicks",      value: totalClicks.toLocaleString(),      color: "text-orange-500" },
              { label: "Conversions", value: totalConversions.toLocaleString(), color: "text-emerald-600" },
            ].map((s) => (
              <div key={s.label}>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              CTR: <strong className="text-ink">{totalImpr ? ((totalClicks/totalImpr)*100).toFixed(2) : "—"}%</strong> ·
              CVR: <strong className="text-ink">{totalClicks ? ((totalConversions/totalClicks)*100).toFixed(1) : "—"}%</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
