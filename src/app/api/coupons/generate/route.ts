import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import getAuthDb from "@/lib/auth-db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { discountPercent, maxUses, expiresInDays, customCode } =
      await request.json();

    if (!discountPercent || discountPercent < 1 || discountPercent > 100) {
      return NextResponse.json(
        { error: "Discount must be between 1 and 100" },
        { status: 400 }
      );
    }

    const code = customCode?.toUpperCase() || `BW-${uuidv4().slice(0, 8).toUpperCase()}`;
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
      : null;

    const db = getAuthDb();
    db.prepare(
      "INSERT INTO coupons (code, discount_percent, max_uses, expires_at) VALUES (?, ?, ?, ?)"
    ).run(code, discountPercent, maxUses || 1, expiresAt);
    db.close();

    return NextResponse.json({
      message: "Coupon created",
      coupon: { code, discountPercent, maxUses: maxUses || 1, expiresAt },
    });
  } catch (error) {
    console.error("Coupon generate error:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
