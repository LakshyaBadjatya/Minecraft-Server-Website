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
  const purchases = db
    .prepare(
      "SELECT id, minecraft_username, rank_id, price, status, created_at FROM purchases ORDER BY created_at DESC LIMIT 50"
    )
    .all();
  db.close();

  return NextResponse.json(purchases);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await request.json();
  const db = getAuthDb();
  db.prepare("UPDATE purchases SET status = 'applied' WHERE id = ?").run(id);
  db.close();

  return NextResponse.json({ message: "Marked as applied" });
}
