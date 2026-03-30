import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCached, setCached } from "@/lib/cache";
import { fetchUserGuilds } from "@/lib/discord";

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

async function fetchGuildsFromDiscord(accessToken: string) {
  const data = await fetchUserGuilds(accessToken);

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

  return filtered;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const forceRefresh = url.searchParams.get("refresh") === "true";

  const cacheKey = `guilds:${session.user?.id}`;

  if (!forceRefresh) {
    const cached = await getCached(cacheKey);
    if (cached) {
      return Response.json(cached);
    }
  }

  try {
    const guilds = await fetchGuildsFromDiscord(session.accessToken);

    await setCached(cacheKey, guilds);

    return Response.json(guilds);
  } catch (error) {
    console.error("Guild fetch failed:", error);

    return Response.json(
      [
        {
          id: "fallback",
          name: "Unknown Server",
          icon: null,
          permissions: "0",
          manageable: false,

          access: 0,
          source: "fallback",
        },
      ],
      { status: 200 }
    );
  }
}