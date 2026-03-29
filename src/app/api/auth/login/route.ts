import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getAuthDb from "@/lib/auth-db";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = getAuthDb();

    const user = db
      .prepare(
        "SELECT id, username, minecraft_username, email, password_hash, is_admin FROM users WHERE username = ? OR email = ?"
      )
      .get(username, username) as {
      id: number;
      username: string;
      minecraft_username: string;
      email: string;
      password_hash: string;
      is_admin: number;
    } | undefined;

    if (!user) {
      db.close();
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      db.close();
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    db.close();

    const token = signToken({
      userId: user.id,
      username: user.username,
      isAdmin: user.is_admin === 1,
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        username: user.username,
        minecraftUsername: user.minecraft_username,
        email: user.email,
        isAdmin: user.is_admin === 1,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
