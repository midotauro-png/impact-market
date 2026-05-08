import { NextRequest, NextResponse } from "next/server";
import { vendors, categories } from "@/lib/mock-data";
import { rankVendors } from "@/lib/vendor-ranking";

// GET /api/vendors?lat=&lng=&zone=&category=&q=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat       = parseFloat(searchParams.get("lat") ?? "26.2154");
  const lng       = parseFloat(searchParams.get("lng") ?? "50.5860");
  const zoneId    = searchParams.get("zone") ?? "z-manama";
  const category  = searchParams.get("category") ?? undefined;
  const q         = searchParams.get("q") ?? undefined;

  const categoryId = category
    ? categories.find((c) => c.slug === category)?.id
    : undefined;

  const ranked = rankVendors(vendors, categories, {
    customerLat: lat,
    customerLng: lng,
    customerZoneId: zoneId,
    categoryId,
    searchQuery: q,
  });

  return NextResponse.json({ vendors: ranked });
}
