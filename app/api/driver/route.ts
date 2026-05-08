import { NextRequest, NextResponse } from "next/server";
import { drivers } from "@/lib/mock-data";
import { haversineKm } from "@/lib/zones";

// GET /api/driver?zone=&lat=&lng= — find nearest available driver in a zone
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zoneId = searchParams.get("zone");
  const lat    = parseFloat(searchParams.get("lat") ?? "0");
  const lng    = parseFloat(searchParams.get("lng") ?? "0");

  const available = drivers.filter(
    (d) => d.is_online && d.status === "approved" &&
      (!zoneId || d.preferred_zone_ids.includes(zoneId) || d.active_zone_id === zoneId)
  );

  if (!available.length) {
    return NextResponse.json({ driver: null, message: "No drivers available" });
  }

  // Sort by distance to vendor pickup point
  const sorted = available.sort((a, b) =>
    haversineKm({ lat: a.lat, lng: a.lng }, { lat, lng }) -
    haversineKm({ lat: b.lat, lng: b.lng }, { lat, lng })
  );

  return NextResponse.json({ driver: sorted[0] });
}
