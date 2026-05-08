// Vendor ranking algorithm: zone match → distance → rating → delivery time → promos → featured

import type { Vendor, RankedVendor, VendorCategory } from "./types";
import { haversineKm, zoneById, ZONES, calculateDeliveryFee } from "./zones";

interface RankOptions {
  customerLat: number;
  customerLng: number;
  customerZoneId: string;
  categoryId?: string;
  searchQuery?: string;
}

export function rankVendors(
  vendors: Vendor[],
  categories: VendorCategory[],
  opts: RankOptions
): RankedVendor[] {
  const { customerLat, customerLng, customerZoneId } = opts;
  const customerZone = zoneById(customerZoneId);

  const ranked: RankedVendor[] = vendors
    .filter((v) => {
      if (v.status !== "approved") return false;
      if (opts.categoryId && v.category_id !== opts.categoryId) return false;
      if (opts.searchQuery) {
        const q = opts.searchQuery.toLowerCase();
        if (!v.business_name.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .map((v) => {
      const sameZone = v.zone_id === customerZoneId;
      const distKm = haversineKm(
        { lat: customerLat, lng: customerLng },
        { lat: v.lat, lng: v.lng }
      );

      // Delivery time = zone base + distance factor
      const vendorZone = zoneById(v.zone_id);
      const baseMin = vendorZone?.estimated_delivery_min ?? 30;
      const estimatedMin = Math.round(baseMin + distKm * 1.5);

      // ─── Ranking scores ──────────────────────────────────────────────────
      // Zone match: 40 pts same zone, graded by km otherwise
      const zoneScore = sameZone
        ? 40
        : Math.max(0, 30 - distKm * 2);

      // Distance: 0 km = 20 pts, -2 pts per km
      const distanceScore = Math.max(0, 20 - distKm * 2);

      // Rating: 0–5 → 0–15 pts
      const ratingScore = (v.rating / 5) * 15;

      // Delivery time: fastest = 10 pts, -0.1 pt per minute
      const deliveryScore = Math.max(0, 10 - estimatedMin * 0.1);

      // Open now: 10 pts bonus
      const openScore = v.is_open ? 10 : 0;

      // Featured: 5 pts boost
      const featuredScore = v.is_featured ? 5 : 0;

      const ranking_score =
        zoneScore +
        distanceScore +
        ratingScore +
        deliveryScore +
        openScore +
        featuredScore;

      const cat = categories.find((c) => c.id === v.category_id);

      return {
        ...v,
        ranking_score,
        distance_km: Math.round(distKm * 10) / 10,
        same_zone: sameZone,
        estimated_delivery_min: estimatedMin,
        zone_name: zoneById(v.zone_id)?.name ?? "Unknown",
        category_name: cat?.name ?? "Other",
      } satisfies RankedVendor;
    });

  // Sort: closed vendors always last
  return ranked.sort((a, b) => {
    if (a.is_open !== b.is_open) return a.is_open ? -1 : 1;
    return b.ranking_score - a.ranking_score;
  });
}
