// Order profit & payout calculation

import type { Order, PlatformSettings } from "./types";
import { calculateDeliveryFee } from "./zones";

export const DEFAULT_SETTINGS: PlatformSettings = {
  // Commission
  default_commission_pct:   12,
  food_commission_pct:      12,   // food / restaurant vendors
  products_commission_pct:  12,   // physical products (range 10–15%, default 12%)

  // Fees
  service_fee_fils: 300,
  min_order_fils:   2500,         // 2.500 BHD minimum order

  // Client delivery fees — km-based
  same_zone_delivery_fils: 700,   // 0–3 km
  near_zone_delivery_fils: 1000,  // 3–6 km
  mid_zone_delivery_fils:  1300,  // 6–9 km
  far_zone_delivery_fils:  1600,  // 9–12+ km

  // Driver pay — km-based
  driver_pay_near_fils:  500,     // 0–3 km
  driver_pay_mid_fils:   700,     // 3–6 km
  driver_pay_far_fils:   900,     // 6–9 km
  driver_pay_xfar_fils:  1100,    // 9–12+ km

  // Free delivery: order ≥ 8 BHD → customer pays 0 delivery, vendor absorbs driver cost
  free_delivery_min_order_fils:  8000,
  free_delivery_vendor_shares:   true,

  // Toggles
  cod_enabled:            true,
  online_payment_enabled: true,
  platform_paused:        false,
};

// Commission constants exported for easy reference
export const COMMISSION = {
  FOOD:         DEFAULT_SETTINGS.food_commission_pct,
  PRODUCTS_MIN: 10,
  PRODUCTS_MAX: 15,
  PRODUCTS_DEFAULT: DEFAULT_SETTINGS.products_commission_pct,
} as const;

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
