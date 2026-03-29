import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import getAuthDb from "@/lib/auth-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const db = getAuthDb();
  const coupons = db
    .prepare("SELECT * FROM coupons ORDER BY created_at DESC")
    .all();
  db.close();

  return NextResponse.json(coupons);
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Coupon ID required" }, { status: 400 });
  }

  const db = getAuthDb();
  db.prepare("DELETE FROM coupons WHERE id = ?").run(id);
  db.close();

  return NextResponse.json({ message: "Coupon deleted" });
}
