// Order profit & payout calculation

import type { Order, PlatformSettings, SubscriptionPlan, SurchargeType } from "./types";
import { calculateDeliveryFee } from "./zones";

export const DEFAULT_SETTINGS: PlatformSettings = {
  // Commission
  default_commission_pct:   12,
  food_commission_pct:      12,   // food / restaurant vendors
  products_commission_pct:  12,   // physical products (range 10–15%, default 12%)

  // Fees
  service_fee_fils: 300,
  min_order_fils:   2500,         // 2.500 BHD minimum order

  // Client delivery fees — 5 km-based tiers
  same_zone_delivery_fils: 700,   // 0–3 km
  near_zone_delivery_fils: 1000,  // 3–6 km
  mid_zone_delivery_fils:  1300,  // 6–9 km
  far_zone_delivery_fils:  1600,  // 9–12 km
  xfar_zone_delivery_fils: 2000,  // 12+ km
  max_delivery_km:         15,    // block orders beyond this km

  // Driver pay — km-based
  driver_pay_near_fils:  500,     // 0–3 km
  driver_pay_mid_fils:   700,     // 3–6 km
  driver_pay_far_fils:   900,     // 6–9 km
  driver_pay_xfar_fils:  1100,    // 9–12+ km

  // Driver daily bonuses
  driver_bonus_tier1_deliveries: 10,  // after 10 deliveries/day
  driver_bonus_tier1_fils:      100,  // +0.100 BHD per extra delivery
  driver_bonus_tier2_deliveries: 20,  // after 20 deliveries/day
  driver_bonus_tier2_fils:      200,  // +0.200 BHD per extra delivery

  // Surcharges
  rush_surcharge_fils:    200,    // customer pays +0.200 BHD (rush)
  rush_driver_bonus_fils: 150,    // driver gets 0.150 BHD; platform keeps 0.050 BHD
  rain_surcharge_fils:    300,    // customer pays +0.300 BHD (rain/high-demand)
  rain_driver_bonus_fils: 250,    // driver gets 0.250 BHD; platform keeps 0.050 BHD

  // Free delivery: order ≥ 8 BHD → customer pays 0 delivery, vendor absorbs driver cost
  free_delivery_min_order_fils:  8000,
  free_delivery_vendor_shares:   true,

  // Toggles
  cod_enabled:            true,
  online_payment_enabled: true,
  platform_paused:        false,
};

// ─── Subscription plans ────────────────────────────────────────────────────────

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    monthly_fee_fils: 0,
    commission_pct: 15,
    max_products: 20,
    ranking_boost: 0,
    is_featured_eligible: false,
    promo_placement: false,
    advanced_dashboard: false,
    description: [
      "Up to 20 products",
      "Standard ranking",
      "15% commission per order",
      "Basic order management",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthly_fee_fils: 10_000,
    commission_pct: 12,
    max_products: 100,
    ranking_boost: 8,
    is_featured_eligible: false,
    promo_placement: false,
    advanced_dashboard: true,
    description: [
      "Up to 100 products",
      "Better search ranking (+8 pts)",
      "12% commission per order",
      "Sales dashboard",
      "Run discount campaigns",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    monthly_fee_fils: 25_000,
    commission_pct: 9,
    max_products: null,
    ranking_boost: 20,
    is_featured_eligible: true,
    promo_placement: true,
    advanced_dashboard: true,
    description: [
      "Unlimited products",
      "Priority ranking (+20 pts)",
      "9% commission per order",
      "Featured seller badge",
      "Homepage promo placement",
      "Advanced analytics dashboard",
    ],
  },
];

export function getPlan(id: string): SubscriptionPlan {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id) ?? SUBSCRIPTION_PLANS[0];
}

// ─── Commission constants ──────────────────────────────────────────────────────

export const COMMISSION = {
  FOOD:             12,
  HOMEMADE_FOOD:    10,
  GROCERY:          10,
  BEAUTY_FASHION:   15,
  ACCESSORIES:      12,
  PREMIUM_SELLER:   9,
  DEFAULT:          12,
} as const;

// ─── Driver daily bonus calculation ───────────────────────────────────────────

export function calculateDriverBonus(
  deliveredToday: number,
  settings: PlatformSettings = DEFAULT_SETTINGS
): number {
  if (deliveredToday <= settings.driver_bonus_tier1_deliveries) return 0;
  if (deliveredToday <= settings.driver_bonus_tier2_deliveries) {
    const extra = deliveredToday - settings.driver_bonus_tier1_deliveries;
    return extra * settings.driver_bonus_tier1_fils;
  }
  // Above tier2 threshold
  const tier1Extra = settings.driver_bonus_tier2_deliveries - settings.driver_bonus_tier1_deliveries;
  const tier1Total = tier1Extra * settings.driver_bonus_tier1_fils;
  const tier2Extra = deliveredToday - settings.driver_bonus_tier2_deliveries;
  const tier2Total = tier2Extra * settings.driver_bonus_tier2_fils;
  return tier1Total + tier2Total;
}

// ─── Surcharge calculation ────────────────────────────────────────────────────

export function calculateSurcharge(
  type: SurchargeType,
  settings: PlatformSettings = DEFAULT_SETTINGS
): { customer_fils: number; driver_fils: number; platform_fils: number } {
  if (type === "rush") {
    return {
      customer_fils: settings.rush_surcharge_fils,
      driver_fils:   settings.rush_driver_bonus_fils,
      platform_fils: settings.rush_surcharge_fils - settings.rush_driver_bonus_fils,
    };
  }
  if (type === "rain") {
    return {
      customer_fils: settings.rain_surcharge_fils,
      driver_fils:   settings.rain_driver_bonus_fils,
      platform_fils: settings.rain_surcharge_fils - settings.rain_driver_bonus_fils,
    };
  }
  return { customer_fils: 0, driver_fils: 0, platform_fils: 0 };
}

export interface OrderFinancials {
  subtotal_fils: number;
  delivery_fee_fils: number;      // what customer pays (0 if free delivery)
  service_fee_fils: number;
  commission_fils: number;
  driver_payout_fils: number;     // what driver earns (km-based)
  vendor_delivery_share_fils: number; // what vendor absorbs when free delivery applies
  admin_profit_fils: number;
  vendor_net_fils: number;
  total_fils: number;
  delivery_label: string;
  distance_km: number;
  is_free_delivery: boolean;
}

export function calculateOrderFinancials(
  subtotal_fils: number,
  customerZoneId: string,
  vendorZoneId: string,
  commission_pct: number,
  settings: PlatformSettings = DEFAULT_SETTINGS
): OrderFinancials {
  const deliveryResult = calculateDeliveryFee(customerZoneId, vendorZoneId, {
    same_fils:        settings.same_zone_delivery_fils,
    near_fils:        settings.near_zone_delivery_fils,
    mid_fils:         settings.mid_zone_delivery_fils,
    far_fils:         settings.far_zone_delivery_fils,
    xfar_fils:        settings.xfar_zone_delivery_fils,
    driver_near_fils: settings.driver_pay_near_fils,
    driver_mid_fils:  settings.driver_pay_mid_fils,
    driver_far_fils:  settings.driver_pay_far_fils,
    driver_xfar_fils: settings.driver_pay_xfar_fils,
  });

  const driver_payout_fils = deliveryResult.driver_pay_fils;
  const service_fee_fils   = settings.service_fee_fils;
  const commission_fils    = Math.round((subtotal_fils * commission_pct) / 100);

  // Free delivery: order ≥ threshold → customer pays 0, vendor absorbs driver cost
  const is_free_delivery =
    settings.free_delivery_min_order_fils > 0 &&
    subtotal_fils >= settings.free_delivery_min_order_fils;

  const delivery_fee_fils = is_free_delivery ? 0 : deliveryResult.fee_fils;

  // Vendor absorbs driver payout on free delivery orders (vendor shares cost)
  const vendor_delivery_share_fils =
    is_free_delivery && settings.free_delivery_vendor_shares ? driver_payout_fils : 0;

  const vendor_net_fils =
    subtotal_fils - commission_fils - vendor_delivery_share_fils;

  // Admin profit = commission + service fee + delivery margin (only when customer pays delivery)
  const delivery_margin   = is_free_delivery ? 0 : deliveryResult.fee_fils - driver_payout_fils;
  const admin_profit_fils = commission_fils + service_fee_fils + delivery_margin;

  const total_fils = subtotal_fils + delivery_fee_fils + service_fee_fils;

  return {
    subtotal_fils,
    delivery_fee_fils,
    service_fee_fils,
    commission_fils,
    driver_payout_fils,
    vendor_delivery_share_fils,
    admin_profit_fils,
    vendor_net_fils,
    total_fils,
    delivery_label: deliveryResult.label,
    distance_km:    deliveryResult.distance_km,
    is_free_delivery,
  };
}
