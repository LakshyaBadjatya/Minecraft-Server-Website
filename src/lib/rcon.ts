import fs from "fs";
import path from "path";
import Database from "better-sqlite3";

const LUCKPERMS_USERS_DIR = path.resolve(
  "D:/Servers/Server bakups/Bedwars 2023/plugins/LuckPerms/json-storage/users"
);

const BEDWARS_DB_PATH = path.resolve(
  "D:/Servers/Server bakups/Bedwars 2023/plugins/BedWars2023/Cache/player_data.db"
);

// Map rank IDs to LuckPerms group names (lowercase)
const RANK_GROUP_MAP: Record<string, string> = {
  vip: "vip",
  vip_plus: "vip+",
  mvp: "mvp",
  mvp_plus: "mvp+",
  mvp_plus_plus: "mvp++",
};

const RANK_DISPLAY_MAP: Record<string, string> = {
  vip: "VIP",
  vip_plus: "VIP+",
  mvp: "MVP",
  mvp_plus: "MVP+",
  mvp_plus_plus: "MVP++",
};

interface LuckPermsNode {
  key: string;
  value: boolean;
}

interface LuckPermsUser {
  uuid: string;
  name: string;
  primaryGroup: string;
  nodes: LuckPermsNode[];
}

function findPlayerUUID(
  minecraftUsername: string
): { uuid: string; name: string } | null {
  // Check LuckPerms user files first
  if (fs.existsSync(LUCKPERMS_USERS_DIR)) {
    const files = fs.readdirSync(LUCKPERMS_USERS_DIR);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      try {
        const data = JSON.parse(
          fs.readFileSync(path.join(LUCKPERMS_USERS_DIR, file), "utf-8")
        );
        if (data.name?.toLowerCase() === minecraftUsername.toLowerCase()) {
          return {
            uuid: data.uuid || file.replace(".json", ""),
            name: data.name,
          };
        }
      } catch {
        continue;
      }
    }
  }

  // Fall back to BedWars database
  try {
    const db = new Database(BEDWARS_DB_PATH, { readonly: true });
    const player = db
      .prepare(
        "SELECT uuid, name FROM global_stats WHERE LOWER(name) = LOWER(?)"
      )
      .get(minecraftUsername) as { uuid: string; name: string } | undefined;
    db.close();
    if (player) return player;
  } catch {
    // DB not available
  }

  return null;
}

export async function applyRank(
  minecraftUsername: string,
  rankId: string
): Promise<{ success: boolean; response: string }> {
  const group = RANK_GROUP_MAP[rankId];
  const displayName = RANK_DISPLAY_MAP[rankId];
  if (!group) {
    return { success: false, response: "Unknown rank" };
  }

  try {
    if (!fs.existsSync(LUCKPERMS_USERS_DIR)) {
      fs.mkdirSync(LUCKPERMS_USERS_DIR, { recursive: true });
    }

    const player = findPlayerUUID(minecraftUsername);

    if (!player) {
      return {
        success: false,
        response: `Player "${minecraftUsername}" not found. They must join the server at least once first.`,
      };
    }

    const userFilePath = path.join(
      LUCKPERMS_USERS_DIR,
      `${player.uuid}.json`
    );

    let userData: LuckPermsUser;

    if (fs.existsSync(userFilePath)) {
      userData = JSON.parse(fs.readFileSync(userFilePath, "utf-8"));
      // Ensure nodes array exists (migrate from old format if needed)
      if (!userData.nodes) {
        userData.nodes = [{ key: "group.default", value: true }];
      }
    } else {
      userData = {
        uuid: player.uuid,
        name: player.name,
        primaryGroup: "default",
        nodes: [{ key: "group.default", value: true }],
      };
    }

    // Remove old rank group nodes, keep default and non-rank nodes
    const rankGroupKeys = new Set(
      Object.values(RANK_GROUP_MAP).map((g) => `group.${g}`)
    );
    userData.nodes = userData.nodes.filter(
      (node) => !rankGroupKeys.has(node.key)
    );

    // Add the new rank group node
    userData.nodes.push({ key: `group.${group}`, value: true });

    // Set primary group
    userData.primaryGroup = group;

    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2), "utf-8");

    return {
      success: true,
      response: `${displayName} rank applied to ${player.name}! Rejoin the server to see your rank.`,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to apply rank";
    return { success: false, response: message };
  }
}
