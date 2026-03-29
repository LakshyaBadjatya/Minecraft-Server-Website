// Run with: npx tsx scripts/create-admin.ts
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const DB_PATH = path.resolve("D:/VS code projects/Server Website/data/auth.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    minecraft_username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    max_uses INTEGER DEFAULT 1,
    uses INTEGER DEFAULT 0,
    expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    minecraft_username TEXT NOT NULL,
    rank_id TEXT NOT NULL,
    price REAL NOT NULL,
    coupon_code TEXT,
    discount_applied REAL DEFAULT 0,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const username = "admin";
const email = "admin@sukhma.in";
const minecraftUsername = "PixelatedLaku";
const password = "admin123";

const existing = db.prepare("SELECT id FROM users WHERE username = ?").get(username);

if (existing) {
  db.prepare("UPDATE users SET is_admin = 1 WHERE username = ?").run(username);
  console.log(`User '${username}' updated to admin.`);
} else {
  const hash = bcrypt.hashSync(password, 12);
  db.prepare(
    "INSERT INTO users (username, minecraft_username, email, password_hash, is_admin) VALUES (?, ?, ?, ?, 1)"
  ).run(username, minecraftUsername, email, hash);
  console.log(`Admin user created: ${username} / ${password}`);
}

db.close();
