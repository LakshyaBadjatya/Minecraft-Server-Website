import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import getAuthDb from "@/lib/auth-db";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { username, minecraftUsername, email, password } =
      await request.json();

    if (!username || !minecraftUsername || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const db = getAuthDb();

    const existing = db
      .prepare("SELECT id FROM users WHERE username = ? OR email = ?")
      .get(username, email);

    if (existing) {
      db.close();
      return NextResponse.json(
        { error: "Username or email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = db
      .prepare(
        "INSERT INTO users (username, minecraft_username, email, password_hash) VALUES (?, ?, ?, ?)"
      )
      .run(username, minecraftUsername, email, passwordHash);

    db.close();

    const token = signToken({
      userId: result.lastInsertRowid as number,
      username,
      isAdmin: false,
    });

    const response = NextResponse.json({
      message: "Account created successfully",
      user: { username, minecraftUsername, email },
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
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
