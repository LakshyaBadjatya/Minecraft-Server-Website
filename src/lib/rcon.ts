import fs from "fs";
import path from "path";

const PENDING_COMMANDS_FILE = path.resolve(
  "D:/Servers/Server bakups/Bedwars 2023/pending-ranks.txt"
);

// Map rank IDs to LuckPerms group names
const RANK_GROUP_MAP: Record<string, string> = {
  vip: "VIP",
  vip_plus: "VIP+",
  mvp: "MVP",
  mvp_plus: "MVP+",
  mvp_plus_plus: "MVP++",
};

export async function applyRank(
  minecraftUsername: string,
  rankId: string
): Promise<{ success: boolean; response: string; command: string }> {
  const group = RANK_GROUP_MAP[rankId];
  if (!group) {
    return { success: false, response: "Unknown rank", command: "" };
  }

  const command = `lp user ${minecraftUsername} parent add ${group}`;

  try {
    // Append command to pending file for admin to run
    const entry = `[${new Date().toISOString()}] ${command}\n`;
    fs.appendFileSync(PENDING_COMMANDS_FILE, entry, "utf-8");

    return {
      success: true,
      response: `Rank ${group} queued for ${minecraftUsername}. Run the command in server console to apply.`,
      command,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save command";
    return { success: false, response: message, command };
  }
}
