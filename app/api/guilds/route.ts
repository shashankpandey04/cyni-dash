import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Bitmask
const ACCESS = {
  DISCORD: 1 << 0,
  ROBLOX: 1 << 1,
  MANAGER: 1 << 2,
};

function isManageableGuild(permissions: string) {
  const perms = BigInt(permissions);

  const ADMIN = BigInt(0x8);
  const MANAGE_GUILD = BigInt(0x20);

  return (perms & ADMIN) === ADMIN || (perms & MANAGE_GUILD) === MANAGE_GUILD;
}

function resolveDefaultAccess(manageable: boolean) {
  if (!manageable) return 0;

  return ACCESS.DISCORD;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Discord API failed");
    }

    // Normalize
    const guilds = data.map((g: any) => {
      const manageable = isManageableGuild(g.permissions);

      return {
        id: g.id,
        name: g.name,
        icon: g.icon ?? null,
        permissions: g.permissions,
        manageable,

        access: resolveDefaultAccess(manageable),
        source: "discord",
      };
    });

    const filtered = guilds.filter((g: any) => g.manageable);

    return Response.json(filtered);

  } catch (error) {
    console.error("Guild fetch failed:", error);

    return Response.json([
      {
        id: "fallback",
        name: "Unknown Server",
        icon: null,
        permissions: "0",
        manageable: false,

        access: 0,
        source: "fallback",
      },
    ]);
  }
}