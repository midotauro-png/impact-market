"use client";
import { useState } from "react";
import { TrendingUp, DollarSign, Users, ShoppingBag, Megaphone, CreditCard } from "lucide-react";
import { orders, ads, vendors, drivers, pushCampaigns } from "@/lib/mock-data";
import { ZONES } from "@/lib/zones";
import { fmtBHD } from "@/lib/utils";

// ─── SVG Chart primitives ─────────────────────────────────────────────────────

function BarChart({ data, color = "#f97316" }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 360, H = 120, BAR = Math.floor((W / data.length) * 0.55);
  const gap = (W - BAR * data.length) / (data.length + 1);

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full">
      {data.map((d, i) => {
        const barH = Math.max(4, (d.value / max) * H);
        const x = gap + i * (BAR + gap);
        return (
          <g key={i}>
            <rect
              x={x} y={H - barH} width={BAR} height={barH}
              rx={4} fill={color} opacity={0.85}
            />
            <text x={x + BAR / 2} y={H + 14} textAnchor="middle" fontSize={9} fill="#94a3b8">
              {d.label}
            </text>
            <text x={x + BAR / 2} y={H - barH - 4} textAnchor="middle" fontSize={9} fill={color} fontWeight="bold">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function LineChart({ data, color = "#f97316" }: { data: { label: string; value: number }[]; color?: string }) {
  const max  = Math.max(...data.map((d) => d.value), 1);
  const W = 360, H = 100;
  const xs = data.map((_, i) => (i / (data.length - 1)) * W);
  const ys = data.map((d) => H - (d.value / max) * (H - 12) - 4);

  const path    = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x} ${ys[i]}`).join(" ");
  const fill    = `${path} L ${W} ${H + 4} L 0 ${H + 4} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full">
      <defs>
        <linearGradient id={`lg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill}  fill={`url(#lg-${color.replace("#","")})`} />
      <path d={path} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {xs.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={ys[i]} r={3.5} fill={color} />
          <text x={x} y={H + 14} textAnchor="middle" fontSize={9} fill="#94a3b8">{data[i].label}</text>
        </g>
      ))}
    </svg>
  );
}

function DonutChart({ slices }: { slices: { label: string; value: number; color: string }[] }) {
  const total  = slices.reduce((s, x) => s + x.value, 0) || 1;
  const R = 52, CX = 72, CY = 72, SW = 20;
  let angle = -Math.PI / 2;
  const arcs = slices.map((sl) => {
    const a0 = angle, sweep = (sl.value / total) * 2 * Math.PI;
    angle += sweep;
    const x1 = CX + R * Math.cos(a0), y1 = CY + R * Math.sin(a0);
    const x2 = CX + R * Math.cos(a0 + sweep), y2 = CY + R * Math.sin(a0 + sweep);
    const large = sweep > Math.PI ? 1 : 0;
    return { ...sl, d: `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`, sweep };
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 144 144" className="w-28 shrink-0">
        {arcs.map((a, i) =>
          a.sweep > 0.01 ? (
            <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={SW} strokeLinecap="butt" />
          ) : null
        )}
        <text x={CX} y={CY + 4} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#1e293b">{slices.length}</text>
      </svg>
      <div className="space-y-1.5 min-w-0">
        {slices.map((sl, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: sl.color }} />
            <span className="text-slate-600 truncate">{sl.label}</span>
            <span className="ml-auto font-bold text-ink">{((sl.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Data helpers ─────────────────────────────────────────────────────────────

const DAYS   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKS  = ["W1", "W2", "W3", "W4"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May"];

const dailyOrders  = [12, 18, 14, 22, 28, 34, 27];
const dailyRevenue = [34, 52, 41, 68, 84, 102, 81];  // BHD integer
const weeklyOrders = [85, 112, 98, 140];
const monthlyGMV   = [4_200, 5_800, 5_200, 7_100, 8_400];

function zoneOrderData() {
  return ZONES.filter((z) => z.is_active).map((z) => ({
    label: z.name.split(" ")[0],
    value: orders.filter((o) => o.customer_zone_id === z.id).length || Math.floor(Math.random() * 12) + 2,
  })).slice(0, 8);
}

// Revenue streams
const totalCommission = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.commission_fils, 0);
const totalServiceFee = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + o.service_fee_fils, 0);
const totalDeliveryMargin = orders.filter((o) => o.payment_status === "paid").reduce((s, o) => s + Math.max(0, o.admin_profit_fils - o.commission_fils - o.service_fee_fils), 0);
const totalAdRevenue  = ads.reduce((s, a) => s + a.spent_fils, 0);
const totalSubRevenue = vendors.filter((v) => v.subscription_plan !== "free").length * 10_000;

const REVENUE_STREAMS = [
  { label: "Commissions",      value: totalCommission,     color: "#f97316" },
  { label: "Service Fees",     value: totalServiceFee,     color: "#3b82f6" },
  { label: "Delivery Margin",  value: totalDeliveryMargin, color: "#8b5cf6" },
  { label: "Advertising",      value: totalAdRevenue,      color: "#10b981" },
  { label: "Subscriptions",    value: totalSubRevenue,     color: "#f59e0b" },
];

// Top vendors
const topVendors = vendors
  .filter((v) => v.status === "approved")
  .map((v) => ({
    ...v,
    revenue: orders.filter((o) => o.vendor_id === v.id && o.payment_status === "paid").reduce((s, o) => s + o.subtotal_fils, 0),
    orderCount: orders.filter((o) => o.vendor_id === v.id).length,
  }))
  .sort((a, b) => b.revenue - a.revenue)
  .slice(0, 5);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const totalProfit = REVENUE_STREAMS.reduce((s, r) => s + r.value, 0);
  const paidOrders  = orders.filter((o) => o.payment_status === "paid");
  const totalGMV    = paidOrders.reduce((s, o) => s + o.total_fils, 0);
  const activeAdsCount = ads.filter((a) => a.status === "active").length;

  const orderChartData =
    period === "daily"   ? DAYS.map((l, i) => ({ label: l, value: dailyOrders[i] })) :
    period === "weekly"  ? WEEKS.map((l, i) => ({ label: l, value: weeklyOrders[i] })) :
                           MONTHS.map((l, i) => ({ label: l, value: Math.floor(monthlyGMV[i] / 300) }));

  const revenueChartData =
    period === "daily"   ? DAYS.map((l, i) => ({ label: l, value: dailyRevenue[i] })) :
    period === "weekly"  ? WEEKS.map((l, i) => ({ label: l, value: weeklyOrders[i] * 3 })) :
                           MONTHS.map((l, i) => ({ label: l, value: Math.floor(monthlyGMV[i] / 1_000) }));

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-black text-ink flex items-center gap-2">
          <TrendingUp size={20} className="text-orange-500" /> Analytics & Insights
        </h2>
        <div className="flex gap-1.5">
          {(["daily", "weekly", "monthly"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                period === p ? "bg-orange-500 text-white border-orange-500" : "border-slate-200 text-slate-600 hover:border-orange-300"
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Top KPIs ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "Total GMV",      value: fmtBHD(totalGMV),            icon: <DollarSign size={16} />,  color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Platform Profit",value: fmtBHD(totalProfit),          icon: <TrendingUp size={16} />,  color: "text-orange-500",  bg: "bg-orange-50" },
          { label: "Paid Orders",    value: paidOrders.length,            icon: <ShoppingBag size={16} />, color: "text-blue-600",    bg: "bg-blue-50" },
          { label: "Vendors",        value: vendors.filter((v) => v.status === "approved").length, icon: <Users size={16} />, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Drivers",        value: drivers.filter((d) => d.status === "approved").length, icon: <Users size={16} />, color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Active Ads",     value: activeAdsCount,              icon: <Megaphone size={16} />,   color: "text-pink-600",    bg: "bg-pink-50" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className={`h-8 w-8 rounded-lg mx-auto flex items-center justify-center mb-2 ${s.bg} ${s.color}`}>{s.icon}</div>
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="stat-label text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Order Volume + Revenue Charts ──────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="font-bold text-ink mb-4">Order Volume</p>
          <BarChart data={orderChartData} color="#f97316" />
        </div>
        <div className="card p-5">
          <p className="font-bold text-ink mb-4">Revenue (BHD)</p>
          <LineChart data={revenueChartData} color="#10b981" />
        </div>
      </div>

      {/* ── Revenue Streams + Zone Heatmap ─────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card p-5">
          <p className="font-bold text-ink mb-4">Revenue Streams</p>
          <DonutChart slices={REVENUE_STREAMS.map((r) => ({ label: r.label, value: r.value, color: r.color }))} />
          <div className="mt-5 space-y-2">
            {REVENUE_STREAMS.map((r) => (
              <div key={r.label} className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: r.color }} />
                  <span className="text-slate-600">{r.label}</span>
                </span>
                <span className="font-bold text-ink">{fmtBHD(r.value)}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm border-t pt-2 mt-2 font-black text-ink">
              <span>Total Profit</span>
              <span className="text-orange-500">{fmtBHD(totalProfit)}</span>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="font-bold text-ink mb-4">Orders by Zone</p>
          <BarChart data={zoneOrderData()} color="#8b5cf6" />

          <div className="mt-5 space-y-2">
            {zoneOrderData().sort((a, b) => b.value - a.value).slice(0, 5).map((z, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="font-semibold w-4 text-slate-400">{i + 1}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${(z.value / zoneOrderData()[0].value) * 100}%` }} />
                </div>
                <span className="text-slate-600 w-20 truncate">{z.label}</span>
                <span className="font-bold text-ink w-6 text-right">{z.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ad Performance Chart ───────────────────────────────── */}
      <div className="card p-5">
        <p className="font-bold text-ink mb-4">Ad Revenue Breakdown</p>
        <div className="grid sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: "Total Ad Revenue",     value: fmtBHD(totalAdRevenue),                  color: "text-emerald-600" },
            { label: "Total Impressions",     value: ads.reduce((s,a)=>s+a.impressions,0).toLocaleString(), color: "text-blue-600" },
            { label: "Total Conversions",     value: ads.reduce((s,a)=>s+a.conversions,0).toLocaleString(), color: "text-orange-500" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <BarChart
          data={ads.map((a) => ({ label: a.advertiser_name.split(" ")[0], value: Math.round(a.spent_fils / 1000) }))}
          color="#ec4899"
        />
      </div>

      {/* ── Top Vendors Table ──────────────────────────────────── */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink flex items-center gap-2">
          <CreditCard size={16} className="text-orange-400" /> Top Performing Vendors
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>#</th><th>Vendor</th><th>Orders</th><th>GMV</th><th>Commission</th><th>Plan</th><th>Rating</th></tr>
            </thead>
            <tbody>
              {topVendors.map((v, i) => {
                const comm = orders.filter((o) => o.vendor_id === v.id && o.payment_status === "paid").reduce((s, o) => s + o.commission_fils, 0);
                return (
                  <tr key={v.id}>
                    <td className="font-black text-slate-400 text-sm">{i + 1}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={v.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover bg-slate-100 shrink-0" />
                        <span className="font-semibold text-ink text-sm">{v.business_name}</span>
                      </div>
                    </td>
                    <td className="font-semibold text-sm">{v.orderCount}</td>
                    <td className="font-semibold text-sm">{fmtBHD(v.revenue)}</td>
                    <td className="font-bold text-emerald-600 text-sm">{fmtBHD(comm)}</td>
                    <td><span className="badge-orange capitalize">{v.subscription_plan}</span></td>
                    <td className="text-sm font-semibold text-amber-500">{'★'.repeat(Math.round(v.rating))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Driver + Subscription Stats ────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="card p-5 space-y-4">
          <p className="font-bold text-ink">Subscription Revenue</p>
          {(["free", "growth", "premium"] as const).map((plan) => {
            const count = vendors.filter((v) => v.subscription_plan === plan && v.status === "approved").length;
            const fees  = { free: 0, growth: 10_000, premium: 25_000 }[plan];
            return (
              <div key={plan} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${plan === "premium" ? "bg-amber-400" : plan === "growth" ? "bg-blue-400" : "bg-slate-300"}`} />
                  <span className="capitalize font-semibold text-ink">{plan}</span>
                  <span className="text-slate-400">({count} vendors)</span>
                </div>
                <span className="font-bold text-emerald-600">{fmtBHD(count * fees)}/mo</span>
              </div>
            );
          })}
        </div>

        <div className="card p-5 space-y-4">
          <p className="font-bold text-ink">Push Campaign Revenue</p>
          {pushCampaigns.map((pc) => (
            <div key={pc.id} className="flex items-center justify-between text-sm">
              <div className="min-w-0">
                <p className="font-semibold text-ink truncate">{pc.vendor_name}</p>
                <p className="text-xs text-slate-400 capitalize">{pc.status}</p>
              </div>
              <span className="font-bold text-emerald-600 shrink-0">{fmtBHD(pc.price_fils)}</span>
            </div>
          ))}
          <div className="border-t pt-2 flex justify-between font-bold text-sm">
            <span className="text-slate-600">Total</span>
            <span className="text-orange-500">{fmtBHD(pushCampaigns.reduce((s, p) => s + p.price_fils, 0))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
