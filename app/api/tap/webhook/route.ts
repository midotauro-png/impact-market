import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("hashstring") ?? "";
    const secret = process.env.TAP_WEBHOOK_SECRET;

    // Verify Tap HMAC signature (skip if secret not configured)
    if (secret) {
      const expected = createHmac("sha256", secret).update(body).digest("hex");
      if (expected !== signature) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    const chargeId     = event?.id;
    const chargeStatus = event?.status; // "CAPTURED" | "DECLINED" | "CANCELLED"
    const orderCode    = event?.reference?.transaction;

    console.log(`[Tap Webhook] charge=${chargeId} status=${chargeStatus} order=${orderCode}`);

    // In production: update order payment_status in Supabase
    // const supabase = getSupabaseServer();
    // if (supabase && orderCode) {
    //   await supabase.from("orders").update({
    //     payment_status: chargeStatus === "CAPTURED" ? "paid" : "failed",
    //     tap_charge_id: chargeId,
    //     status: chargeStatus === "CAPTURED" ? "sent_to_vendor" : "cancelled",
    //   }).eq("short_code", orderCode);
    // }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Tap Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
