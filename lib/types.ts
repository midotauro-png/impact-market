// Bahrain Marketplace — all shared TypeScript types

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "vendor" | "driver" | "customer";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "suspended";
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
  is_featured: boolean;
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
  default_commission_pct: number;
  service_fee_fils: number;
  same_zone_delivery_fils: number;
  near_zone_delivery_fils: number;  // < 5 km away
  mid_zone_delivery_fils: number;   // 5–10 km
  far_zone_delivery_fils: number;   // 10+ km
  driver_payout_fils: number;
  cod_enabled: boolean;
  online_payment_enabled: boolean;
  platform_paused: boolean;
  free_delivery_min_order_fils: number; // 0 = disabled
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
