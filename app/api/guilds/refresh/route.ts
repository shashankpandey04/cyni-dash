import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { clearCached } from "@/lib/cache";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cacheKey = `guilds:${session.user.id}`;
    await clearCached(cacheKey);

    return Response.json({
      success: true,
      message: "Cache cleared, will refresh on next fetch",
    });
  } catch (error) {
    console.error("Cache clear failed:", error);

    return Response.json(
      { error: "Failed to refresh cache" },
      { status: 500 }
    );
  }
}
