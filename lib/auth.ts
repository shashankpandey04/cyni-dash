import { cookies } from "next/headers";

export async function getAuth() {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.AUTH_API_URL}/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
