// Bahrain Marketplace — all shared TypeScript types

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "vendor" | "driver" | "customer";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended";
export type SubscriptionPlanId = "free" | "growth" | "premium";
export type SurchargeType = "none" | "rush" | "rain";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "sent_to_vendor"
  | "vendor_accepted"
  | "vendor_preparing"
  | "driver_assigned"
  | "driver_picked_up"
  | "on_the_way"
  | "delivered"
  | "cancelled"
  | "refunded";
export type PaymentMethod = "online" | "cash_on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type VehicleType = "bike" | "car" | "scooter";
export type PayoutStatus = "pending" | "paid";

// ─── Subscription Plans ──────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  monthly_fee_fils: number;    // 0 | 10_000 | 25_000
  commission_pct: number;      // 15 | 12 | 9
  max_products: number | null; // 20 | 100 | null = unlimited
  ranking_boost: number;       // extra ranking score points
  is_featured_eligible: boolean;
  promo_placement: boolean;
  advanced_dashboard: boolean;
  description: string[];
}

// ─── Map & Zones ──────────────────────────────────────────────────────────────

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Zone {
  id: string;
  name: string;
  slug: string;
  cities: string[];               // area names included
  polygon: LatLng[];              // boundary polygon
  centroid: LatLng;               // pre-computed center
  base_delivery_fee_fils: number; // same-zone delivery fee in fils
  min_order_fils: number;
  estimated_delivery_min: number; // minutes
  is_active: boolean;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
}

// ─── Vendors ──────────────────────────────────────────────────────────────────

export interface VendorCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  commission_pct: number; // platform commission for this category
}

export interface OpeningHours {
  open: string;   // "08:00"
  close: string;  // "22:00"
  days: number[]; // 0=Sun … 6=Sat
}

export interface Vendor {
  id: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  phone: string;
  email: string;
  cr_number?: string;
  category_id: string;
  address: string;
  lat: number;
  lng: number;
  zone_id: string;
  delivery_radius_km: number;
  opening_hours: OpeningHours;
  logo_url: string;
  cover_url: string;
  status: ApprovalStatus;
  commission_pct: number;
  subscription_plan: SubscriptionPlanId;
  preparation_time_minutes: number;
  is_featured: boolean;
  is_premium: boolean;
  rating: number;
  total_orders: number;
  is_open: boolean;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  vendor_id: string;
  category_id: string;
  name: string;
  description: string;
  price_fils: number;
  stock: number;
  images: string[];
  is_active: boolean;
  created_at: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price_fils: number;
  image?: string;
}

export interface Order {
  id: string;
  short_code: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  vendor_id: string;
  driver_id: string | null;
  customer_zone_id: string;
  vendor_zone_id: string;
  delivery_address: string;
  delivery_lat: number;
  delivery_lng: number;
  items: OrderItem[];
  subtotal_fils: number;
  delivery_fee_fils: number;
  service_fee_fils: number;
  commission_fils: number;
  driver_payout_fils: number;
  admin_profit_fils: number;
  vendor_net_fils: number;
  total_fils: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  tap_charge_id?: string;
  created_at: string;
}

// ─── Drivers ──────────────────────────────────────────────────────────────────

export interface Driver {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  cpr: string;
  vehicle_type: VehicleType;
  vehicle_plate: string;
  lat: number;
  lng: number;
  active_zone_id: string;
  preferred_zone_ids: string[];
  is_online: boolean;
  status: ApprovalStatus;
  rating: number;
  total_deliveries: number;
  wallet_fils: number;
}

// ─── Payouts ──────────────────────────────────────────────────────────────────

export interface VendorPayout {
  id: string;
  vendor_id: string;
  vendor_name: string;
  order_id: string;
  gross_fils: number;
  commission_fils: number;
  net_fils: number;
  status: PayoutStatus;
  created_at: string;
}

export interface DriverPayout {
  id: string;
  driver_id: string;
  driver_name: string;
  order_id: string;
  amount_fils: number;
  status: PayoutStatus;
  created_at: string;
}

// ─── Platform Settings ────────────────────────────────────────────────────────

export interface PlatformSettings {
  // Commission rates
  default_commission_pct: number;        // fallback
  food_commission_pct: number;           // food / restaurant vendors = 12%
  products_commission_pct: number;       // physical products = 10–15% (default 12%)

  // Fees
  service_fee_fils: number;
  min_order_fils: number;                // 2 500 fils = 2.500 BHD

  // Client-facing delivery fee — 5 km-based tiers
  same_zone_delivery_fils: number;       // 0–3 km   = 700 fils
  near_zone_delivery_fils: number;       // 3–6 km   = 1 000 fils
  mid_zone_delivery_fils: number;        // 6–9 km   = 1 300 fils
  far_zone_delivery_fils: number;        // 9–12 km  = 1 600 fils
  xfar_zone_delivery_fils: number;       // 12+ km   = 2 000 fils
  max_delivery_km: number;               // block orders beyond this (default 15)

  // Driver pay — km-based tiers
  driver_pay_near_fils: number;          // 0–3 km   = 500 fils
  driver_pay_mid_fils: number;           // 3–6 km   = 700 fils
  driver_pay_far_fils: number;           // 6–9 km   = 900 fils
  driver_pay_xfar_fils: number;          // 9–12+ km = 1 100 fils

  // Driver daily bonuses
  driver_bonus_tier1_deliveries: number; // 10 deliveries/day threshold
  driver_bonus_tier1_fils: number;       // +100 fils per extra delivery above tier1
  driver_bonus_tier2_deliveries: number; // 20 deliveries/day threshold
  driver_bonus_tier2_fils: number;       // +200 fils per extra delivery above tier2

  // Surcharges (rush / rain / high-demand)
  rush_surcharge_fils: number;           // added to customer fee = 200
  rush_driver_bonus_fils: number;        // driver gets = 150; platform keeps 50
  rain_surcharge_fils: number;           // added to customer fee = 300
  rain_driver_bonus_fils: number;        // driver gets = 250; platform keeps 50

  // Free delivery (customer pays 0 delivery when order ≥ threshold)
  free_delivery_min_order_fils: number;  // 0 = disabled; 8 000 = above 8 BHD
  free_delivery_vendor_shares: boolean;  // true = vendor absorbs driver cost

  // Toggles
  cod_enabled: boolean;
  online_payment_enabled: boolean;
  platform_paused: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  order_id: string;
  customer_name: string;
  vendor_id?: string;
  driver_id?: string;
  rating: number;
  comment: string;
  created_at: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product_id: string;
  vendor_id: string;
  name: string;
  price_fils: number;
  quantity: number;
  image: string;
}

// ─── Vendor ranking ───────────────────────────────────────────────────────────

export interface RankedVendor extends Vendor {
  ranking_score: number;
  distance_km: number;
  same_zone: boolean;
  estimated_delivery_min: number;
  zone_name: string;
  category_name: string;
}

// ─── Advertising ──────────────────────────────────────────────────────────────

export type AdPlacementType =
  | "homepage_banner"
  | "category_banner"
  | "sponsored_vendor"
  | "sponsored_product"
  | "search_keyword"
  | "zone_takeover"
  | "push_notification"
  | "driver_bag";

export type AdPricingModel =
  | "fixed_weekly"
  | "fixed_monthly"
  | "cpc"        // cost per click
  | "cpm"        // cost per 1000 impressions
  | "cpo";       // cost per order/conversion

export type AdStatus = "pending" | "active" | "paused" | "rejected" | "expired";

export interface Ad {
  id: string;
  advertiser_type: "vendor" | "external";
  advertiser_id: string;          // vendor_id or external business id
  advertiser_name: string;
  title: string;
  description?: string;
  image_url: string;
  target_url: string;
  placement_type: AdPlacementType;
  target_zone_ids: string[];      // empty = all zones
  target_category_ids: string[];  // empty = all categories
  target_keywords: string[];
  start_date: string;
  end_date: string;
  pricing_model: AdPricingModel;
  price_fils: number;             // weekly/monthly flat or rate per click/impression
  budget_fils: number;            // total campaign budget cap
  spent_fils: number;             // amount spent so far
  status: AdStatus;
  impressions: number;
  clicks: number;
  conversions: number;
  created_at: string;
}

export interface AdEvent {
  id: string;
  ad_id: string;
  user_id?: string;
  event_type: "impression" | "click" | "conversion";
  zone_id?: string;
  order_id?: string;
  created_at: string;
}

// ─── Push Notification Campaign ───────────────────────────────────────────────

export interface PushCampaign {
  id: string;
  vendor_id: string;
  vendor_name: string;
  title: string;
  body: string;
  target_zone_ids: string[];
  target_category_ids: string[];
  schedule_at: string;
  status: "draft" | "scheduled" | "sent" | "cancelled";
  reach: number;                  // estimated reach
  sent_count: number;
  open_rate_pct: number;
  price_fils: number;
  created_at: string;
}
