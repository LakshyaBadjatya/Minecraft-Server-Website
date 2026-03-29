import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import getAuthDb from "@/lib/auth-db";
import { ranks } from "@/lib/ranks";
import { applyRank } from "@/lib/rcon";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  try {
    const { rankId, couponCode, minecraftUsername } = await request.json();

    const rank = ranks.find((r) => r.id === rankId);
    if (!rank) {
      return NextResponse.json({ error: "Invalid rank" }, { status: 400 });
    }

    const db = getAuthDb();

    const dbUser = db
      .prepare("SELECT minecraft_username FROM users WHERE id = ?")
      .get(user.userId) as { minecraft_username: string } | undefined;

    if (!dbUser) {
      db.close();
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUsername = minecraftUsername?.trim() || dbUser.minecraft_username;

    if (!targetUsername || targetUsername.length < 3 || targetUsername.length > 16) {
      db.close();
      return NextResponse.json(
        { error: "Invalid Minecraft username" },
        { status: 400 }
      );
    }

    let discount = 0;
    let finalPrice = rank.price;

    if (couponCode) {
      const coupon = db
        .prepare("SELECT * FROM coupons WHERE code = ?")
        .get(couponCode.toUpperCase()) as {
        id: number;
        discount_percent: number;
        max_uses: number;
        uses: number;
        expires_at: string | null;
      } | undefined;

      if (coupon && coupon.uses < coupon.max_uses) {
        if (
          !coupon.expires_at ||
          new Date(coupon.expires_at) > new Date()
        ) {
          discount = (rank.price * coupon.discount_percent) / 100;
          finalPrice = rank.price - discount;

          db.prepare(
            "UPDATE coupons SET uses = uses + 1 WHERE id = ?"
          ).run(coupon.id);
        }
      }
    }

    const rconResult = await applyRank(targetUsername, rankId);

    db.prepare(
      "INSERT INTO purchases (user_id, minecraft_username, rank_id, price, coupon_code, discount_applied, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(
      user.userId,
      targetUsername,
      rankId,
      finalPrice,
      couponCode || null,
      discount,
      "pending"
    );

    db.close();

    return NextResponse.json({
      message: `${rank.name} rank purchased for ${targetUsername}! It will be applied shortly by an admin.`,
      applied: false,
      command: rconResult.command,
      purchase: {
        rank: rank.name,
        originalPrice: rank.price,
        discount,
        finalPrice,
        minecraftUsername: targetUsername,
      },
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
