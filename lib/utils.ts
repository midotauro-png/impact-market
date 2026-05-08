import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format fils to BHD string: 1000 fils → "1.000 BHD"
export function fmtBHD(fils: number): string {
  return (fils / 1000).toFixed(3) + " BHD";
}

// Short human-readable relative time
export function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Generate a short alphanumeric order code
export function shortCode(prefix = "BHM"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// Truncate string
export function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

// Status label helpers
export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid: "Paid",
  sent_to_vendor: "Sent to Vendor",
  vendor_accepted: "Vendor Accepted",
  vendor_preparing: "Preparing",
  driver_assigned: "Driver Assigned",
  driver_picked_up: "Picked Up",
  on_the_way: "On the Way",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending_payment: "bg-amber-100 text-amber-700",
  paid: "bg-sky-100 text-sky-700",
  sent_to_vendor: "bg-blue-100 text-blue-700",
  vendor_accepted: "bg-blue-100 text-blue-700",
  vendor_preparing: "bg-orange-100 text-orange-700",
  driver_assigned: "bg-purple-100 text-purple-700",
  driver_picked_up: "bg-purple-100 text-purple-700",
  on_the_way: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-600",
};

export const APPROVAL_COLOR: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-100 text-gray-600",
};
