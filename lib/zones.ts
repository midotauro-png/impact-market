// Bahrain zone definitions, polygon matching, and delivery fee calculation.
// Polygons are approximate rectangle-based boundaries; production usage should
// use surveyed polygons drawn in the admin zone editor.

import type { LatLng, Zone } from "./types";

// ─── Zone polygon data ────────────────────────────────────────────────────────
// Each polygon is a closed ring [SW, NW, NE, SE] for simplicity.
// Coordinates: real approximate Bahrain lat/lng.

export const ZONES: Zone[] = [
  {
    id: "z-manama",
    name: "Manama",
    slug: "manama",
    cities: ["Manama", "Government Area", "Diplomatic Area"],
    polygon: [
      { lat: 26.195, lng: 50.560 },
      { lat: 26.240, lng: 50.560 },
      { lat: 26.240, lng: 50.610 },
      { lat: 26.195, lng: 50.610 },
    ],
    centroid: { lat: 26.2154, lng: 50.5860 },
    base_delivery_fee_fils: 1000,
    min_order_fils: 2000,
    estimated_delivery_min: 25,
    is_active: true,
  },
  {
    id: "z-juffair",
    name: "Juffair",
    slug: "juffair",
    cities: ["Juffair", "Umm Al Hassam"],
    polygon: [
      { lat: 26.190, lng: 50.590 },
      { lat: 26.215, lng: 50.590 },
      { lat: 26.215, lng: 50.615 },
      { lat: 26.190, lng: 50.615 },
    ],
    centroid: { lat: 26.2034, lng: 50.5975 },
    base_delivery_fee_fils: 1000,
    min_order_fils: 2000,
    estimated_delivery_min: 25,
    is_active: true,
  },
  {
    id: "z-adliya",
    name: "Adliya",
    slug: "adliya",
    cities: ["Adliya", "Salmaniya"],
    polygon: [
      { lat: 26.198, lng: 50.565 },
      { lat: 26.225, lng: 50.565 },
      { lat: 26.225, lng: 50.595 },
      { lat: 26.198, lng: 50.595 },
    ],
    centroid: { lat: 26.2124, lng: 50.5803 },
    base_delivery_fee_fils: 1000,
    min_order_fils: 2000,
    estimated_delivery_min: 20,
    is_active: true,
  },
  {
    id: "z-seef",
    name: "Seef",
    slug: "seef",
    cities: ["Seef", "Sanabis", "Zinj North"],
    polygon: [
      { lat: 26.210, lng: 50.520 },
      { lat: 26.248, lng: 50.520 },
      { lat: 26.248, lng: 50.560 },
      { lat: 26.210, lng: 50.560 },
    ],
    centroid: { lat: 26.2285, lng: 50.5401 },
    base_delivery_fee_fils: 1200,
    min_order_fils: 2000,
    estimated_delivery_min: 30,
    is_active: true,
  },
  {
    id: "z-muharraq",
    name: "Muharraq",
    slug: "muharraq",
    cities: ["Muharraq", "Arad", "Galali", "Busaiteen"],
    polygon: [
      { lat: 26.240, lng: 50.600 },
      { lat: 26.290, lng: 50.600 },
      { lat: 26.290, lng: 50.660 },
      { lat: 26.240, lng: 50.660 },
    ],
    centroid: { lat: 26.2583, lng: 50.6200 },
    base_delivery_fee_fils: 1500,
    min_order_fils: 2000,
    estimated_delivery_min: 35,
    is_active: true,
  },
  {
    id: "z-riffa",
    name: "Riffa",
    slug: "riffa",
    cities: ["East Riffa", "West Riffa", "Al Hajiyat"],
    polygon: [
      { lat: 26.095, lng: 50.630 },
      { lat: 26.160, lng: 50.630 },
      { lat: 26.160, lng: 50.700 },
      { lat: 26.095, lng: 50.700 },
    ],
    centroid: { lat: 26.1299, lng: 50.6580 },
    base_delivery_fee_fils: 1500,
    min_order_fils: 2000,
    estimated_delivery_min: 40,
    is_active: true,
  },
  {
    id: "z-isa-town",
    name: "Isa Town",
    slug: "isa-town",
    cities: ["Isa Town", "Aali", "Nuwaidrat"],
    polygon: [
      { lat: 26.150, lng: 50.525 },
      { lat: 26.200, lng: 50.525 },
      { lat: 26.200, lng: 50.575 },
      { lat: 26.150, lng: 50.575 },
    ],
    centroid: { lat: 26.1745, lng: 50.5529 },
    base_delivery_fee_fils: 1200,
    min_order_fils: 2000,
    estimated_delivery_min: 35,
    is_active: true,
  },
  {
    id: "z-hamad-town",
    name: "Hamad Town",
    slug: "hamad-town",
    cities: ["Hamad Town", "Sheikh Khalifa"],
    polygon: [
      { lat: 26.100, lng: 50.475 },
      { lat: 26.155, lng: 50.475 },
      { lat: 26.155, lng: 50.540 },
      { lat: 26.100, lng: 50.540 },
    ],
    centroid: { lat: 26.1280, lng: 50.5088 },
    base_delivery_fee_fils: 1500,
    min_order_fils: 2000,
    estimated_delivery_min: 45,
    is_active: true,
  },
  {
    id: "z-budaiya",
    name: "Budaiya",
    slug: "budaiya",
    cities: ["Budaiya", "Bani Jamra", "Jasra"],
    polygon: [
      { lat: 26.185, lng: 50.440 },
      { lat: 26.235, lng: 50.440 },
      { lat: 26.235, lng: 50.485 },
      { lat: 26.185, lng: 50.485 },
    ],
    centroid: { lat: 26.2115, lng: 50.4612 },
    base_delivery_fee_fils: 1500,
    min_order_fils: 2000,
    estimated_delivery_min: 40,
    is_active: true,
  },
  {
    id: "z-saar",
    name: "Saar",
    slug: "saar",
    cities: ["Saar", "Janabiyah", "Duraz"],
    polygon: [
      { lat: 26.185, lng: 50.470 },
      { lat: 26.235, lng: 50.470 },
      { lat: 26.235, lng: 50.515 },
      { lat: 26.185, lng: 50.515 },
    ],
    centroid: { lat: 26.2106, lng: 50.4904 },
    base_delivery_fee_fils: 1200,
    min_order_fils: 2000,
    estimated_delivery_min: 35,
    is_active: true,
  },
  {
    id: "z-zinj",
    name: "Zinj",
    slug: "zinj",
    cities: ["Zinj", "Qudaibiya", "Gudaibiya"],
    polygon: [
      { lat: 26.175, lng: 50.560 },
      { lat: 26.210, lng: 50.560 },
      { lat: 26.210, lng: 50.600 },
      { lat: 26.175, lng: 50.600 },
    ],
    centroid: { lat: 26.1944, lng: 50.5814 },
    base_delivery_fee_fils: 1000,
    min_order_fils: 2000,
    estimated_delivery_min: 25,
    is_active: true,
  },
  {
    id: "z-hoora",
    name: "Hoora",
    slug: "hoora",
    cities: ["Hoora", "Exhibition Road"],
    polygon: [
      { lat: 26.213, lng: 50.570 },
      { lat: 26.237, lng: 50.570 },
      { lat: 26.237, lng: 50.600 },
      { lat: 26.213, lng: 50.600 },
    ],
    centroid: { lat: 26.2239, lng: 50.5837 },
    base_delivery_fee_fils: 1000,
    min_order_fils: 2000,
    estimated_delivery_min: 20,
    is_active: true,
  },
  {
    id: "z-hidd",
    name: "Hidd",
    slug: "hidd",
    cities: ["Hidd", "Fasht Al Adhm"],
    polygon: [
      { lat: 26.240, lng: 50.630 },
      { lat: 26.270, lng: 50.630 },
      { lat: 26.270, lng: 50.665 },
      { lat: 26.240, lng: 50.665 },
    ],
    centroid: { lat: 26.2565, lng: 50.6484 },
    base_delivery_fee_fils: 1500,
    min_order_fils: 2000,
    estimated_delivery_min: 40,
    is_active: true,
  },
  {
    id: "z-amwaj",
    name: "Amwaj Islands",
    slug: "amwaj",
    cities: ["Amwaj Islands"],
    polygon: [
      { lat: 26.268, lng: 50.618 },
      { lat: 26.300, lng: 50.618 },
      { lat: 26.300, lng: 50.660 },
      { lat: 26.268, lng: 50.660 },
    ],
    centroid: { lat: 26.2814, lng: 50.6383 },
    base_delivery_fee_fils: 2000,
    min_order_fils: 3000,
    estimated_delivery_min: 50,
    is_active: true,
  },
  {
    id: "z-aali",
    name: "Aali",
    slug: "aali",
    cities: ["Aali", "Jaw", "Askar"],
    polygon: [
      { lat: 26.130, lng: 50.525 },
      { lat: 26.175, lng: 50.525 },
      { lat: 26.175, lng: 50.565 },
      { lat: 26.130, lng: 50.565 },
    ],
    centroid: { lat: 26.1520, lng: 50.5428 },
    base_delivery_fee_fils: 1200,
    min_order_fils: 2000,
    estimated_delivery_min: 35,
    is_active: true,
  },
];

// ─── Point-in-polygon (ray casting) ─────────────────────────────────────────

export function pointInPolygon(point: LatLng, polygon: LatLng[]): boolean {
  const { lat: y, lng: x } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng, yi = polygon[i].lat;
    const xj = polygon[j].lng, yj = polygon[j].lat;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// ─── Detect zone from coordinates ────────────────────────────────────────────

export function detectZone(lat: number, lng: number): Zone | null {
  const pt: LatLng = { lat, lng };
  return ZONES.find((z) => z.is_active && pointInPolygon(pt, z.polygon)) ?? null;
}

export function zoneById(id: string): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}

// ─── Distance between two lat/lng (Haversine, km) ────────────────────────────

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

// ─── Zone-to-zone distance (centroid) ────────────────────────────────────────

export function zoneDistance(z1: Zone, z2: Zone): number {
  return haversineKm(z1.centroid, z2.centroid);
}

// ─── Delivery fee calculation ─────────────────────────────────────────────────

export interface DeliveryFeeResult {
  fee_fils: number;
  label: string;
  distance_km: number;
}

export function calculateDeliveryFee(
  customerZoneId: string,
  vendorZoneId: string,
  settings?: { same_fils?: number; near_fils?: number; mid_fils?: number; far_fils?: number }
): DeliveryFeeResult {
  const s = {
    same_fils: settings?.same_fils ?? 1000,
    near_fils: settings?.near_fils ?? 1500,
    mid_fils: settings?.mid_fils ?? 2000,
    far_fils: settings?.far_fils ?? 3000,
  };

  const cz = zoneById(customerZoneId);
  const vz = zoneById(vendorZoneId);

  if (!cz || !vz) return { fee_fils: s.near_fils, label: "Standard", distance_km: 0 };

  if (customerZoneId === vendorZoneId) {
    return { fee_fils: s.same_fils, label: "Same zone", distance_km: 0 };
  }

  const dist = zoneDistance(cz, vz);
  if (dist < 5) return { fee_fils: s.near_fils, label: "Nearby", distance_km: dist };
  if (dist < 10) return { fee_fils: s.mid_fils, label: "Medium distance", distance_km: dist };
  return { fee_fils: s.far_fils, label: "Long distance", distance_km: dist };
}

// ─── Get sorted nearby zones ──────────────────────────────────────────────────

export function nearbySortedZones(fromZoneId: string, maxKm = 15): Zone[] {
  const from = zoneById(fromZoneId);
  if (!from) return ZONES.filter((z) => z.is_active);
  return ZONES.filter((z) => z.is_active && z.id !== fromZoneId)
    .map((z) => ({ zone: z, dist: zoneDistance(from, z) }))
    .filter((x) => x.dist <= maxKm)
    .sort((a, b) => a.dist - b.dist)
    .map((x) => x.zone);
}
