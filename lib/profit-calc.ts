// Order profit & payout calculation

import type { Order, PlatformSettings } from "./types";
import { calculateDeliveryFee } from "./zones";

export const DEFAULT_SETTINGS: PlatformSettings = {
  default_commission_pct: 15,
  service_fee_fils: 300,
  same_zone_delivery_fils: 1000,
  near_zone_delivery_fils: 1500,
  mid_zone_delivery_fils: 2000,
  far_zone_delivery_fils: 3000,
  driver_payout_fils: 1000,
  cod_enabled: true,
  online_payment_enabled: true,
  platform_paused: false,
  free_delivery_min_order_fils: 0,
};

export interface OrderFinancials {
  subtotal_fils: number;
  delivery_fee_fils: number;
  service_fee_fils: number;
  commission_fils: number;
  driver_payout_fils: number;
  admin_profit_fils: number;
  vendor_net_fils: number;
  total_fils: number;
  delivery_label: string;
}

export function calculateOrderFinancials(
  subtotal_fils: number,
  customerZoneId: string,
  vendorZoneId: string,
  commission_pct: number,
  settings: PlatformSettings = DEFAULT_SETTINGS
): OrderFinancials {
  const deliveryResult = calculateDeliveryFee(customerZoneId, vendorZoneId, {
    same_fils: settings.same_zone_delivery_fils,
    near_fils: settings.near_zone_delivery_fils,
    mid_fils: settings.mid_zone_delivery_fils,
    far_fils: settings.far_zone_delivery_fils,
  });

  // Free delivery override
  const delivery_fee_fils =
    settings.free_delivery_min_order_fils > 0 &&
    subtotal_fils >= settings.free_delivery_min_order_fils
      ? 0
      : deliveryResult.fee_fils;

  const service_fee_fils = settings.service_fee_fils;
  const commission_fils = Math.round((subtotal_fils * commission_pct) / 100);
  const driver_payout_fils = settings.driver_payout_fils;

  // Admin profit = commission + service fee + (delivery fee - driver payout)
  const delivery_margin = delivery_fee_fils - driver_payout_fils;
  const admin_profit_fils = commission_fils + service_fee_fils + delivery_margin;

  const vendor_net_fils = subtotal_fils - commission_fils;
  const total_fils = subtotal_fils + delivery_fee_fils + service_fee_fils;

  return {
    subtotal_fils,
    delivery_fee_fils,
    service_fee_fils,
    commission_fils,
    driver_payout_fils,
    admin_profit_fils,
    vendor_net_fils,
    total_fils,
    delivery_label: deliveryResult.label,
  };
}
