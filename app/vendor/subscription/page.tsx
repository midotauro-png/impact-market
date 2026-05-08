"use client";
import { useState } from "react";
import { Check, Star, Zap, Crown, AlertCircle } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/profit-calc";
import { fmtBHD } from "@/lib/utils";
import type { SubscriptionPlanId } from "@/lib/types";

const DEMO_CURRENT: SubscriptionPlanId = "growth";

const PLAN_ICONS: Record<SubscriptionPlanId, React.ReactNode> = {
  free:    <Star    size={22} className="text-slate-400" />,
  growth:  <Zap     size={22} className="text-amber-500" />,
  premium: <Crown   size={22} className="text-amber-400" />,
};

const PLAN_COLORS: Record<SubscriptionPlanId, string> = {
  free:    "border-slate-200 bg-white",
  growth:  "border-amber-300 bg-amber-50",
  premium: "border-yellow-400 bg-gradient-to-br from-yellow-50 to-amber-50",
};

const PLAN_BADGE: Record<SubscriptionPlanId, string | null> = {
  free:    null,
  growth:  "Most Popular",
  premium: "Best Value",
};

export default function VendorSubscriptionPage() {
  const [current, setCurrent] = useState<SubscriptionPlanId>(DEMO_CURRENT);
  const [confirming, setConfirming] = useState<SubscriptionPlanId | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSelect(planId: SubscriptionPlanId) {
    if (planId === current) return;
    setConfirming(planId);
  }

  function handleConfirm() {
    if (!confirming) return;
    setCurrent(confirming);
    setConfirming(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const currentPlan = SUBSCRIPTION_PLANS.find((p) => p.id === current)!;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-black text-ink">Subscription Plan</h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose the plan that fits your business. Commission is calculated on product subtotal only — not delivery fees.
        </p>
      </div>

      {/* Current plan banner */}
      <div className="card p-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200">
        <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
          {PLAN_ICONS[current]}
        </div>
        <div>
          <p className="font-bold text-emerald-800 text-sm">
            Active Plan: <span className="capitalize">{currentPlan.name}</span>
          </p>
          <p className="text-xs text-emerald-600">
            {currentPlan.monthly_fee_fils === 0
              ? "Free forever"
              : `${fmtBHD(currentPlan.monthly_fee_fils)}/month`}{" "}
            · {currentPlan.commission_pct}% commission · {currentPlan.max_products ?? "Unlimited"} products
          </p>
        </div>
        {success && (
          <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">
            ✓ Plan updated
          </span>
        )}
      </div>

      {/* Launch offer notice */}
      <div className="card p-4 flex items-start gap-3 border border-orange-200 bg-orange-50">
        <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-bold text-orange-800">🚀 Launch Offer — First 30 Sellers</p>
          <p className="text-xs text-orange-700 mt-0.5">
            First 3 months: 0 BHD monthly fee · 10% commission for all plans · Standard rates apply after launch period.
          </p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const isCurrent = plan.id === current;
          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-5 flex flex-col gap-4 transition ${PLAN_COLORS[plan.id]} ${isCurrent ? "ring-2 ring-emerald-400" : ""}`}
            >
              {PLAN_BADGE[plan.id] && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black bg-amber-400 text-white px-3 py-0.5 rounded-full uppercase tracking-widest">
                  {PLAN_BADGE[plan.id]}
                </span>
              )}

              <div className="flex items-center gap-2">
                {PLAN_ICONS[plan.id]}
                <span className="font-black text-ink text-base capitalize">{plan.name}</span>
                {isCurrent && (
                  <span className="ml-auto text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>

              <div>
                <p className="text-2xl font-black text-ink">
                  {plan.monthly_fee_fils === 0 ? "Free" : fmtBHD(plan.monthly_fee_fils)}
                  {plan.monthly_fee_fils > 0 && (
                    <span className="text-sm font-normal text-slate-500">/month</span>
                  )}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {plan.commission_pct}% commission · {plan.max_products ?? "Unlimited"} products
                </p>
              </div>

              <ul className="space-y-1.5 flex-1">
                {plan.description.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-700">
                    <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelect(plan.id)}
                disabled={isCurrent}
                className={`w-full rounded-xl py-2.5 text-sm font-bold transition ${
                  isCurrent
                    ? "bg-slate-100 text-slate-400 cursor-default"
                    : plan.id === "premium"
                    ? "bg-amber-400 hover:bg-amber-500 text-white"
                    : "btn-primary"
                }`}
              >
                {isCurrent ? "Current Plan" : `Switch to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirm modal overlay */}
      {confirming && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="font-black text-ink text-lg">Confirm Plan Change</h3>
            <p className="text-sm text-slate-600">
              Switch to{" "}
              <span className="font-bold capitalize">{confirming}</span> plan?{" "}
              {SUBSCRIPTION_PLANS.find((p) => p.id === confirming)!.monthly_fee_fils > 0
                ? `You will be charged ${fmtBHD(SUBSCRIPTION_PLANS.find((p) => p.id === confirming)!.monthly_fee_fils)}/month.`
                : "This plan is free."}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(null)} className="btn-ghost flex-1">Cancel</button>
              <button onClick={handleConfirm} className="btn-primary flex-1">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Commission reference table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 font-bold text-ink text-sm">
          Commission by Category
        </div>
        <div className="table-wrapper rounded-none rounded-b-2xl">
          <table className="data-table">
            <thead><tr><th>Category</th><th>Commission Rate</th></tr></thead>
            <tbody>
              {[
                ["Bahraini / African Food", "12%"],
                ["Homemade Food", "10%"],
                ["Groceries & African Products", "10%"],
                ["Restaurants", "12%"],
                ["Beauty & Cosmetics", "15%"],
                ["Fashion & Clothes", "15%"],
                ["Accessories", "12%"],
                ["Oud & Perfume", "15%"],
                ["Premium High-Volume Sellers", "8–10%"],
              ].map(([cat, rate]) => (
                <tr key={cat}>
                  <td className="text-sm">{cat}</td>
                  <td className="font-bold text-orange-600">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
