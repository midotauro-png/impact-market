import { DollarSign, TrendingUp, Clock, Zap, Gift } from "lucide-react";
import { drivers, ordersByDriver } from "@/lib/mock-data";
import { fmtBHD, relTime } from "@/lib/utils";
import { DEFAULT_SETTINGS, calculateDriverBonus } from "@/lib/profit-calc";

const DEMO_DRIVER_ID = "d-1";

export default function DriverEarningsPage() {
  const driver    = drivers.find((d) => d.id === DEMO_DRIVER_ID)!;
  const allOrders = ordersByDriver(DEMO_DRIVER_ID);
  const delivered = allOrders.filter((o) => o.status === "delivered");

  const totalEarned      = delivered.reduce((s, o) => s + o.driver_payout_fils, 0);
  const available        = driver.wallet_fils;
  const pending          = Math.max(0, totalEarned - available);
  const todayCount       = delivered.length; // demo: treat all as today
  const bonusEarned      = calculateDriverBonus(todayCount, DEFAULT_SETTINGS);

  const t1 = DEFAULT_SETTINGS.driver_bonus_tier1_deliveries;
  const t2 = DEFAULT_SETTINGS.driver_bonus_tier2_deliveries;
  const nextTarget       = todayCount < t1 ? t1 : todayCount < t2 ? t2 : null;
  const progressMax      = nextTarget ?? t2;
  const progressPct      = Math.min(100, Math.round((todayCount / progressMax) * 100));

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-black text-ink">Earnings</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Earned",   value: fmtBHD(totalEarned), icon: <DollarSign className="text-emerald-500" />, bg: "bg-emerald-50" },
          { label: "Available Now",  value: fmtBHD(available),   icon: <TrendingUp className="text-blue-500" />,    bg: "bg-blue-50" },
          { label: "Pending",        value: fmtBHD(pending),     icon: <Clock className="text-amber-500" />,        bg: "bg-amber-50" },
          { label: "Bonus Earned",   value: fmtBHD(bonusEarned), icon: <Gift className="text-purple-500" />,        bg: "bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-3 ${s.bg}`}>{s.icon}</div>
            <p className="stat-value text-xl">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Daily bonus tracker */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-500" />
          <p className="font-bold text-ink text-sm">Daily Bonus Tracker</p>
          <span className="ml-auto text-xs font-bold text-amber-600">{todayCount} deliveries today</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>0</span>
          <span className={todayCount >= t1 ? "font-bold text-amber-600" : ""}>{t1} → +{fmtBHD(DEFAULT_SETTINGS.driver_bonus_tier1_fils)} each</span>
          <span className={todayCount >= t2 ? "font-bold text-orange-600" : ""}>{t2} → +{fmtBHD(DEFAULT_SETTINGS.driver_bonus_tier2_fils)} each</span>
        </div>
        {nextTarget ? (
          <p className="text-xs text-slate-500">
            {nextTarget - todayCount} more deliveries to unlock next bonus tier.
          </p>
        ) : (
          <p className="text-xs font-bold text-orange-600">🎉 Max bonus tier unlocked! +{fmtBHD(DEFAULT_SETTINGS.driver_bonus_tier2_fils)} per delivery</p>
        )}
      </div>

      {/* Surcharge reference */}
      <div className="card p-5 space-y-3">
        <p className="font-bold text-ink text-sm">Surge & Rain Bonuses</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Rush Order",        customer: DEFAULT_SETTINGS.rush_surcharge_fils, driver: DEFAULT_SETTINGS.rush_driver_bonus_fils, icon: "⚡" },
            { label: "Rain / High Demand", customer: DEFAULT_SETTINGS.rain_surcharge_fils, driver: DEFAULT_SETTINGS.rain_driver_bonus_fils, icon: "🌧️" },
          ].map((s) => (
            <div key={s.label} className="bg-slate-50 rounded-xl p-3 space-y-1">
              <p className="text-sm font-bold text-ink">{s.icon} {s.label}</p>
              <p className="text-xs text-slate-500">Customer pays +{fmtBHD(s.customer)}</p>
              <p className="text-xs font-bold text-emerald-600">You earn +{fmtBHD(s.driver)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw */}
      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-bold text-ink">Withdraw Earnings</p>
          <p className="text-sm text-slate-500 mt-0.5">Available: <span className="font-bold text-emerald-600">{fmtBHD(available)}</span></p>
        </div>
        <button className="btn-primary">Withdraw to Wallet</button>
      </div>

      {/* History table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">Delivery History</div>
        {delivered.length === 0 ? (
          <p className="p-6 text-slate-400 text-sm text-center">No completed deliveries yet.</p>
        ) : (
          <div className="table-wrapper rounded-none rounded-b-2xl">
            <table className="data-table">
              <thead><tr><th>Order</th><th>Time</th><th>Distance</th><th>Payout</th></tr></thead>
              <tbody>
                {delivered.map((o) => (
                  <tr key={o.id}>
                    <td className="font-mono text-xs text-orange-500">{o.short_code}</td>
                    <td className="text-xs text-slate-400">{relTime(o.created_at)}</td>
                    <td className="text-xs text-slate-500">
                      {o.customer_zone_id === o.vendor_zone_id ? "0–3 km" : "3–6 km"}
                    </td>
                    <td className="font-bold text-emerald-600">{fmtBHD(o.driver_payout_fils)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
