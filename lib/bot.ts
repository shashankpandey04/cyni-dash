import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

const API_URL = process.env.BOT_API_URL!;
const API_KEY = process.env.BOT_API_KEY!;

export async function botFetch(endpoint: string, options?: RequestInit) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized.");
  }

  // Issue a bot token
  const auth = await fetch(`${API_URL}/auth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
    body: JSON.stringify({
      user_id: session.user.id,
    }),
  });

  if (!auth.ok) {
    console.error("Status:", auth.status);
    console.error(await auth.text());

    throw new Error("Failed to authenticate with bot.");
  }

  const jwt = await auth.json();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${jwt.access_token}`,
      "X-API-KEY": API_KEY,
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error("Bot API request failed.");
  }

  return response.json();
}
