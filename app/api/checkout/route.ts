import { NextRequest, NextResponse } from "next/server";
import { shortCode } from "@/lib/utils";
import { calculateOrderFinancials, DEFAULT_SETTINGS } from "@/lib/profit-calc";
import { vendorById } from "@/lib/mock-data";
import type { CartItem, PaymentMethod } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_phone,
      delivery_address,
      customer_zone_id,
      items,
      payment_method,
    }: {
      customer_name: string;
      customer_phone: string;
      delivery_address: string;
      customer_zone_id: string;
      items: CartItem[];
      payment_method: PaymentMethod;
    } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const vendorId = items[0].vendor_id;
    const vendor = vendorById(vendorId);
    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    const subtotal_fils = items.reduce((s: number, i: CartItem) => s + i.price_fils * i.quantity, 0);
    const financials = calculateOrderFinancials(
      subtotal_fils,
      customer_zone_id,
      vendor.zone_id,
      vendor.commission_pct,
      DEFAULT_SETTINGS
    );

    const order_code = shortCode("BHM");

    // ─── Tap Payments integration ─────────────────────────────────────────────
    // In production: call Tap API to create a charge, get redirect_url.
    // For demo mode (no API key): simulate COD flow.
    const tapKey = process.env.TAP_SECRET_KEY;
    let redirect_url: string | null = null;

    if (tapKey && payment_method === "online") {
      try {
        const tapRes = await fetch("https://api.tap.company/v2/charges", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tapKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: financials.total_fils / 1000,
            currency: "BHD",
            description: `Order ${order_code} — Bahrain Marketplace`,
            reference: { transaction: order_code },
            source: { id: "src_all" },
            redirect: {
              url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/orders`,
            },
          }),
        });
        const tapData = await tapRes.json();
        redirect_url = tapData?.transaction?.url ?? null;
      } catch {
        // Tap unavailable — fall through to demo mode
      }
    }

    // ─── Persist to Supabase (if configured) ─────────────────────────────────
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl) {
      // Supabase insert would go here in production
    }

    return NextResponse.json({
      order_code,
      redirect_url, // null for COD / demo mode — client shows success screen
      financials,
      message: "Order created successfully",
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
