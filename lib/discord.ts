/**
 * Central Discord API handler with retry logic and rate limit handling
 */

interface DiscordRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  headers?: Record<string, string>;
  body?: any;
  retries?: number;
  backoffMultiplier?: number;
}

interface DiscordRateLimitError extends Error {
  retryAfter: number;
  status: number;
}

const DEFAULT_RETRIES = 3;
const DEFAULT_BACKOFF_MULTIPLIER = 1000; // ms

/**
 * Make a request to Discord API with automatic retry on rate limits
 * Handles 429 (Too Many Requests) with exponential backoff
 */
export async function discordFetch(
  endpoint: string,
  accessToken: string,
  options: DiscordRequestOptions = {}
): Promise<any> {
  const {
    method = "GET",
    headers = {},
    body,
    retries = DEFAULT_RETRIES,
    backoffMultiplier = DEFAULT_BACKOFF_MULTIPLIER,
  } = options;

  const makeRequest = async (attempt: number = 0): Promise<any> => {
    try {
      const response = await fetch(`https://discord.com/api${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      const data = await response.json();

      // Handling rate limiting (429)
      if (response.status === 429) {
        const retryAfter = data.retry_after
          ? parseInt(data.retry_after) * 1000
          : backoffMultiplier * Math.pow(2, attempt);

        if (attempt < retries) {
          console.warn(
            `[Discord API] Rate limited. Retrying after ${retryAfter}ms (attempt ${attempt + 1}/${retries})`
          );

          // Gonna wait before retrying
          await new Promise((resolve) => setTimeout(resolve, retryAfter));

          return makeRequest(attempt + 1);
        } else {
          const error = new Error(
            "Discord API rate limited - max retries exceeded"
          ) as DiscordRateLimitError;
          error.retryAfter = retryAfter;
          error.status = 429;
          throw error;
        }
      }

      // Handle other yaps of discord API
      if (!response.ok) {
        const message = data?.message || `Discord API error: ${response.status}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      // Re-throw Discord rate limit errors
      if (
        error instanceof Error &&
        "retryAfter" in error &&
        "status" in error
      ) {
        throw error;
      }

      // Retry on network errors - grandma wifi
      if (attempt < retries && error instanceof TypeError) {
        console.warn(
          `[Discord API] Network error on attempt ${attempt + 1}/${retries}, retrying...`
        );
        const delay = backoffMultiplier * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return makeRequest(attempt + 1);
      }

      throw error;
    }
  };

  return makeRequest();
}

/**
 * Fetch user guilds from Discord API
 * Returns array of guilds the user is a member of
 */
export async function fetchUserGuilds(
  accessToken: string,
  options?: Omit<DiscordRequestOptions, "method" | "body">
) {
  return discordFetch("/users/@me/guilds", accessToken, {
    method: "GET",
    ...options,
  });
}
