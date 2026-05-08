import { NextRequest, NextResponse } from "next/server";
import { detectZone, ZONES } from "@/lib/zones";

// GET /api/zones — list all zones
// GET /api/zones?lat=26.21&lng=50.58 — detect zone from coordinates
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  if (lat && lng) {
    const zone = detectZone(parseFloat(lat), parseFloat(lng));
    return NextResponse.json({ zone: zone ?? null });
  }

  return NextResponse.json({ zones: ZONES });
}
