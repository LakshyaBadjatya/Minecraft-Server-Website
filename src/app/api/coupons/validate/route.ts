import { NextResponse } from "next/server";
import getAuthDb from "@/lib/auth-db";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const db = getAuthDb();
    const coupon = db
      .prepare("SELECT * FROM coupons WHERE code = ?")
      .get(code.toUpperCase()) as {
      id: number;
      code: string;
      discount_percent: number;
      max_uses: number;
      uses: number;
      expires_at: string | null;
    } | undefined;
    db.close();

    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon code" },
        { status: 404 }
      );
    }

    if (coupon.uses >= coupon.max_uses) {
      return NextResponse.json(
        { valid: false, error: "Coupon has been fully redeemed" },
        { status: 400 }
      );
    }

    if (
      coupon.expires_at &&
      new Date(coupon.expires_at) < new Date()
    ) {
      return NextResponse.json(
        { valid: false, error: "Coupon has expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      discountPercent: coupon.discount_percent,
      code: coupon.code,
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
