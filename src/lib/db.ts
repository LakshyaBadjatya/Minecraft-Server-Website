import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.resolve(
  "D:/Servers/Server bakups/Bedwars 2023/plugins/BedWars2023/Cache/player_data.db"
);

const GROUPSTATS_DB_PATH = path.resolve(
  "D:/Servers/Server bakups/Bedwars 2023/plugins/BedWars2023-GroupStats/statistics.db"
);

const WINSTREAK_DB_PATH = path.resolve(
  "D:/Servers/Server bakups/Bedwars 2023/plugins/BedWars2023/Cache/win_streak.db"
);

export interface PlayerStats {
  name: string;
  uuid: string;
  wins: number;
  kills: number;
  final_kills: number;
  looses: number;
  deaths: number;
  final_deaths: number;
  beds_destroyed: number;
  games_played: number;
  first_play: string | null;
  last_play: string | null;
}

export interface PlayerLevel {
  uuid: string;
  level: number;
  xp: number;
  name: string;
  next_cost: number;
}

export interface WinStreak {
  uuid: string;
  current_streak: number;
  best_streak: number;
}

function getDb() {
  return new Database(DB_PATH, { readonly: true });
}

function getGroupStatsDb() {
  return new Database(GROUPSTATS_DB_PATH, { readonly: true });
}

function getWinStreakDb() {
  return new Database(WINSTREAK_DB_PATH, { readonly: true });
}

export function getLeaderboard(
  sortBy: string = "wins",
  limit: number = 20
): (PlayerStats & { level: number; winstreak: number; best_streak: number })[] {
  const db = getDb();
  const wsDb = getWinStreakDb();

  const validColumns = [
    "wins",
    "kills",
    "final_kills",
    "beds_destroyed",
    "games_played",
  ];
  const column = validColumns.includes(sortBy) ? sortBy : "wins";

  const players = db
    .prepare(
      `SELECT name, uuid, wins, kills, final_kills, looses, deaths, final_deaths, beds_destroyed, games_played, first_play, last_play
       FROM global_stats ORDER BY ${column} DESC LIMIT ?`
    )
    .all(limit) as PlayerStats[];

  const levels = db
    .prepare(`SELECT uuid, level, xp, name, next_cost FROM player_levels`)
    .all() as PlayerLevel[];

  const streaks = wsDb
    .prepare(
      `SELECT uuid, current_streak, best_streak FROM bw1058_winstreak`
    )
    .all() as WinStreak[];

  db.close();
  wsDb.close();

  const levelMap = new Map(levels.map((l) => [l.uuid, l]));
  const streakMap = new Map(streaks.map((s) => [s.uuid, s]));

  return players.map((p) => ({
    ...p,
    level: levelMap.get(p.uuid)?.level ?? 0,
    winstreak: streakMap.get(p.uuid)?.current_streak ?? 0,
    best_streak: streakMap.get(p.uuid)?.best_streak ?? 0,
  }));
}

export function getPlayerCount(): number {
  const db = getDb();
  const result = db
    .prepare(`SELECT COUNT(*) as count FROM global_stats`)
    .get() as { count: number };
  db.close();
  return result.count;
}

export function getTotalStats(): {
  totalKills: number;
  totalGames: number;
  totalBeds: number;
} {
  const db = getDb();
  const result = db
    .prepare(
      `SELECT COALESCE(SUM(kills),0) as totalKills, COALESCE(SUM(games_played),0) as totalGames, COALESCE(SUM(beds_destroyed),0) as totalBeds FROM global_stats`
    )
    .get() as { totalKills: number; totalGames: number; totalBeds: number };
  db.close();
  return result;
}
