import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sort") || "wins";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);

  const leaderboard = getLeaderboard(sortBy, limit);
  return NextResponse.json(leaderboard);
}
