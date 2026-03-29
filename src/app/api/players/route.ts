import { NextResponse } from "next/server";
import { getPlayerCount, getTotalStats } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const playerCount = getPlayerCount();
  const totalStats = getTotalStats();
  return NextResponse.json({ playerCount, ...totalStats });
}
