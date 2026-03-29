import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import getAuthDb from "@/lib/auth-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const db = getAuthDb();
  const dbUser = db
    .prepare(
      "SELECT username, minecraft_username, email, is_admin FROM users WHERE id = ?"
    )
    .get(user.userId) as {
    username: string;
    minecraft_username: string;
    email: string;
    is_admin: number;
  } | undefined;
  db.close();

  if (!dbUser) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      userId: user.userId,
      username: dbUser.username,
      minecraftUsername: dbUser.minecraft_username,
      email: dbUser.email,
      isAdmin: dbUser.is_admin === 1,
    },
  });
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
