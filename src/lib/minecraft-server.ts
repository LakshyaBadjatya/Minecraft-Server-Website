import { status } from "minecraft-server-util";

const SERVER_HOST = "localhost";
const SERVER_PORT = 25565;

export interface ServerStatus {
  online: boolean;
  players: { online: number; max: number };
  version: string;
  motd: string;
  favicon: string | null;
  latency: number;
}

export async function getServerStatus(): Promise<ServerStatus> {
  try {
    const result = await status(SERVER_HOST, SERVER_PORT, { timeout: 5000 });
    return {
      online: true,
      players: {
        online: result.players.online,
        max: result.players.max,
      },
      version: result.version.name,
      motd:
        typeof result.motd === "string"
          ? result.motd
          : result.motd.toString(),
      favicon: result.favicon,
      latency: result.roundTripLatency,
    };
  } catch {
    return {
      online: false,
      players: { online: 0, max: 0 },
      version: "1.8.8",
      motd: "",
      favicon: null,
      latency: 0,
    };
  }
}
