"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  manageable: boolean;
  source: "discord" | "fallback" | "enriched";
};

export default function Dashboard() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [error, setError] = useState<string>("");
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
        setError(typeof data?.error === "string" ? data.error : "Failed to load guilds");
        setGuilds([]);
        return;
      }

      setGuilds(Array.isArray(data) ? data : []);
    } catch {
      setError("Failed to load guilds");
      setGuilds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/guilds/refresh", { method: "POST" });
      if (res.ok) {
        await loadGuilds(true);
      } else {
        setError("Failed to refresh cache");
      }
    } catch {
      setError("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadGuilds();
  }, []);

  const filteredGuilds = useMemo(() => {
    const q = query.toLowerCase();

    return guilds.filter((g) =>
      g.name.toLowerCase().includes(q) || g.id.includes(q)
    );
  }, [guilds, query]);

  return (
    <div className="relative min-h-screen bg-black px-4 pb-16 pt-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-linear-to-b from-purple-600/20 via-purple-600/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12">
          <div className="flex items-baseline gap-3 mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Dashboard</p>
            <div className="h-px flex-1 bg-gradient-to-r from-purple-600/30 to-transparent" />
          </div>
          
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-3">
              Your Servers
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Access and manage your Discord server infrastructure. Select any server to configure moderation, automations, and community tools.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-y border-gray-800">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Total Servers</p>
              <p className="text-3xl font-bold text-white mt-1">{guilds.length}</p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Manageable</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">
                {guilds.filter((g) => g.manageable).length}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500">Limited Access</p>
              <p className="text-3xl font-bold text-gray-400 mt-1">
                {guilds.filter((g) => !g.manageable).length}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search servers by name or ID..."
                className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-800 bg-gray-950/50 text-white placeholder-gray-500 outline-none transition hover:border-gray-700 focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-6 py-4 rounded-xl border border-purple-600/50 bg-purple-600/10 text-purple-400 font-medium text-sm uppercase tracking-wide transition-all duration-300 hover:border-purple-500 hover:bg-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-500 ${refreshing ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 rounded-2xl border border-gray-800 bg-gray-900/50 animate-pulse"
                style={{ animationDelay: `${i * 50}ms` }}
              />
            ))}

          {!loading && filteredGuilds.length === 0 && (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-400 text-lg">No servers match your search.</p>
            </div>
          )}

          {!loading &&
            filteredGuilds.map((guild, idx) => (
              <div
                key={guild.id}
                onClick={() => router.push(`/dashboard/${guild.id}`)}
                className="group relative rounded-2xl border border-gray-800 bg-gray-950/50 p-6 cursor-pointer transition-all duration-300 hover:border-purple-600/50 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-purple-600/10 hover:-translate-y-1"
                style={{ animation: `slideUp 0.5s ease-out ${idx * 50}ms both` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="relative">
                  <div className="mb-4 inline-block">
                    <Image
                      src={
                        guild.icon
                          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                          : "/images/cyni-rev.png"
                      }
                      alt={guild.name}
                      width={72}
                      height={72}
                      className="aspect-square rounded-xl border border-gray-800 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full transition-colors duration-300 ${
                        guild.manageable
                          ? "bg-purple-600/20 text-purple-300 border border-purple-600/40"
                          : "bg-gray-800 text-gray-400 border border-gray-700"
                      }`}
                    >
                      {guild.manageable ? "Manage" : "View"}
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold text-white mb-1 truncate group-hover:text-purple-300 transition-colors">
                    {guild.name}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono truncate mb-3">{guild.id}</p>

                  {!guild.manageable && (
                    <p className="text-xs text-gray-500 mb-3">Limited access - view only</p>
                  )}

                  <div className="flex items-center gap-2 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Open Server
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}