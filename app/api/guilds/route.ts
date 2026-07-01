import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { botFetch } from "@/lib/bot";
import { fetchUserGuilds } from "@/lib/discord";

function isManageableGuild(permissions: string) {
  const perms = BigInt(permissions);

  const ADMIN = BigInt(0x8);
  const MANAGE_GUILD = BigInt(0x20);

  return (perms & ADMIN) === ADMIN || (perms & MANAGE_GUILD) === MANAGE_GUILD;
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    // Fetch guilds from Discord
    const guilds = await fetchUserGuilds(session.accessToken);

    // Only keep guilds user can manage
    const manageableGuilds = guilds.filter((guild: any) =>
      isManageableGuild(guild.permissions),
    );

    // Fetch access levels from CYNI Bot
    const access = await botFetch("/website/access/bulk", {
      method: "POST",
      body: JSON.stringify({
        guild_ids: manageableGuilds.map((g: any) => Number(g.id)),
      }),
    });

    // Merge Discord + Bot data
    const data = manageableGuilds.map((guild: any) => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon ?? null,
      permissions: guild.permissions,
      manageable: true,

      access: access[guild.id] ?? {
        administrator: false,

        discord: {
          staff: false,
          management: false,
        },

        roblox: {
          staff: false,
          management: false,
        },
      },
    }));

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to fetch guilds.",
      },
      {
        status: 500,
      },
    );
  }
}
