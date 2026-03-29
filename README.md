# BedWars Server Website

A Minecraft BedWars server website built with Next.js, Framer Motion, and Tailwind CSS featuring a dark Minecraft-themed UI with glassmorphism design.

## Features

- **Live Server Status** — Real-time player count, latency, and online/offline status via Minecraft server query
- **Leaderboard** — Player rankings pulled from the BedWars SQLite database (sortable by wins, kills, finals, beds)
- **Rank Store** — 5 purchasable ranks (VIP, VIP+, MVP, MVP+, MVP++) with automatic in-game application via LuckPerms
- **Coupon System** — Admin panel to generate discount codes with custom percentages, max uses, and expiry dates
- **User Auth** — Registration and login system with JWT cookies and bcrypt password hashing
- **Animated UI** — Framer Motion animations throughout: floating particles, spring transitions, shimmer effects, animated counters

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion**
- **better-sqlite3** (reads BedWars player data + auth database)
- **LuckPerms JSON storage** (direct file writes for rank application)

## Setup

```bash
npm install
npm run dev
```

### Create Admin User

```bash
npx tsx scripts/create-admin.ts
```

Default admin credentials: `admin` / `admin123`

### Configuration

Update paths in these files to match your server location:

- `src/lib/db.ts` — BedWars player database path
- `src/lib/rcon.ts` — LuckPerms JSON storage path
- `src/lib/minecraft-server.ts` — Server host/port for status queries

## Server IP

**play.sukhma.in**
