import { NextRequest, NextResponse } from "next/server";
import { orders } from "@/lib/mock-data";

// GET /api/orders?vendor=&driver=&customer=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vendor   = searchParams.get("vendor");
  const driver   = searchParams.get("driver");
  const customer = searchParams.get("customer");

  let result = [...orders];
  if (vendor)   result = result.filter((o) => o.vendor_id === vendor);
  if (driver)   result = result.filter((o) => o.driver_id === driver);
  if (customer) result = result.filter((o) => o.customer_id === customer);

  return NextResponse.json({ orders: result });
}
