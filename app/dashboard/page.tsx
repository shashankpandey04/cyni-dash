"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, RefreshCw, Search } from "lucide-react";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  manageable: boolean;
  source: "discord" | "fallback" | "enriched";
};

export default function Dashboard() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");

  const router = useRouter();

  const loadGuilds = async (forceRefresh = false) => {
    try {
      setError("");

      const url = forceRefresh ? "/api/guilds?refresh=true" : "/api/guilds";

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(
          typeof data?.error === "string"
            ? data.error
            : "Failed to load communities",
        );
        setGuilds([]);
        return;
      }

      setGuilds(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load communities");
      setGuilds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      const res = await fetch("/api/guilds/refresh", {
        method: "POST",
      });

      if (res.ok) {
        await loadGuilds(true);
      }
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGuilds();
  }, []);

  const filteredGuilds = useMemo(() => {
    const q = query.toLowerCase();

    return guilds.filter(
      (guild) => guild.name.toLowerCase().includes(q) || guild.id.includes(q),
    );
  }, [guilds, query]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-18">
      <div className="mb-10">
        <p className="text-sm font-medium text-cyan-400">Dashboard</p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Your Communities
        </h1>
      </div>
      <div className="mb-10">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search communities..."
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/2
              py-3
              pl-11
              pr-14
              outline-none
              transition
              focus:border-cyan-500/20
            "
          />

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="
              absolute
              right-2
              top-1/2
              -translate-y-1/2
              rounded-lg
              p-2
              text-gray-400
              transition
              hover:bg-white/4
              hover:text-cyan-400
            "
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="
                rounded-2xl
                border
                border-white/10
                p-5
                animate-pulse
              "
            >
              <div className="h-14 w-14 rounded-xl bg-white/4" />

              <div className="mt-4 h-5 w-32 rounded bg-white/4" />

              <div className="mt-6 h-4 w-24 rounded bg-white/4" />
            </div>
          ))}

        {!loading &&
          filteredGuilds.map((guild) => (
            <button
              key={guild.id}
              onClick={() => router.push(`/dashboard/${guild.id}`)}
              className="
                group
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-white/10
                bg-white/2
                px-4
                py-3
                text-left
                transition
                hover:bg-white/3
                hover:border-white/20
              "
            >
              <Image
                src={
                  guild.icon
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : "/images/cyni-rev.png"
                }
                alt={guild.name}
                width={40}
                height={40}
                className="rounded-lg border border-white/10"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{guild.name}</p>

                <p
                  className={`text-xs ${
                    guild.manageable ? "text-cyan-400" : "text-gray-500"
                  }`}
                >
                  {guild.manageable ? "Manage Access" : "View Access"}
                </p>
              </div>

              <ArrowRight
                size={16}
                className="
                  text-gray-500
                  transition
                  group-hover:text-cyan-400
                  group-hover:translate-x-1
                "
              />
            </button>
          ))}
      </div>

      {!loading && filteredGuilds.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          No communities found.
        </div>
      )}
    </div>
  );
}
