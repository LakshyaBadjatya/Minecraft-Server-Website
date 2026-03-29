export interface Rank {
  id: string;
  name: string;
  price: number;
  color: string;
  gradient: string;
  borderColor: string;
  glowColor: string;
  prefix: string;
  features: string[];
  popular?: boolean;
  tebexPackageId?: number; // Set these after creating packages in Tebex dashboard
}

export const ranks: Rank[] = [
  {
    id: "vip",
    name: "VIP",
    price: 4.99,
    color: "#55FF55",
    gradient: "from-green-500 to-green-700",
    borderColor: "#22c55e",
    glowColor: "rgba(34,197,94,0.3)",
    prefix: "&a[VIP]",
    features: [
      "Green name in chat",
      "VIP prefix in-game",
      "Access to /fly in lobby",
      "Join full servers",
      "2x XP boost",
      "Exclusive VIP kit",
    ],
  },
  {
    id: "vip_plus",
    name: "VIP+",
    price: 9.99,
    color: "#55FF55",
    gradient: "from-green-400 to-emerald-600",
    borderColor: "#34d399",
    glowColor: "rgba(52,211,153,0.3)",
    prefix: "&a[VIP&6+&a]",
    features: [
      "All VIP features",
      "Gold + in prefix",
      "3x XP boost",
      "Priority queue",
      "Exclusive cosmetics",
      "Nick command access",
    ],
  },
  {
    id: "mvp",
    name: "MVP",
    price: 19.99,
    color: "#55FFFF",
    gradient: "from-cyan-400 to-blue-600",
    borderColor: "#22d3ee",
    glowColor: "rgba(34,211,238,0.3)",
    prefix: "&b[MVP]",
    features: [
      "All VIP+ features",
      "Aqua name in chat",
      "5x XP boost",
      "Private games access",
      "Exclusive MVP cosmetics",
      "Particle effects",
      "Custom death messages",
    ],
    popular: true,
  },
  {
    id: "mvp_plus",
    name: "MVP+",
    price: 34.99,
    color: "#5555FF",
    gradient: "from-blue-400 to-indigo-600",
    borderColor: "#6366f1",
    glowColor: "rgba(99,102,241,0.3)",
    prefix: "&b[MVP&c+&b]",
    features: [
      "All MVP features",
      "Red + in prefix",
      "8x XP boost",
      "All cosmetics unlocked",
      "Custom join messages",
      "Gadgets menu access",
      "Island topper selection",
      "Glyph selection",
    ],
  },
  {
    id: "mvp_plus_plus",
    name: "MVP++",
    price: 49.99,
    color: "#FFAA00",
    gradient: "from-amber-400 to-orange-600",
    borderColor: "#f59e0b",
    glowColor: "rgba(245,158,11,0.4)",
    prefix: "&6[MVP&c++&6]",
    features: [
      "All MVP+ features",
      "Gold name in chat",
      "10x XP boost",
      "Exclusive MVP++ cosmetics",
      "Custom spray selection",
      "Victory dance selection",
      "All grappling hook modes",
      "Exclusive monthly rewards",
      "Priority support",
    ],
  },
];
