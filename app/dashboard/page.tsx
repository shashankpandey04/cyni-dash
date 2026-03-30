"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const ACCESS = {
  DISCORD: 1 << 0,
  ROBLOX: 1 << 1,
  MANAGER: 1 << 2,
};

function hasAccess(access: number, permission: number) {
  return (access & permission) === permission;
}

type Guild = {
  id: string;
  name: string;
  icon: string | null;
  access: number;
  manageable: boolean;
  source: "discord" | "fallback" | "enriched";
};

export default function Dashboard() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "manageable" | "limited">("all");

  useEffect(() => {
    const loadGuilds = async () => {
      try {
        const res = await fetch("/api/guilds");
        const data = await res.json();

        if (!res.ok) {
          setError(typeof data?.error === "string" ? data.error : "Failed to load guilds");
          setGuilds([]);
          setLoading(false);
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

    loadGuilds();
  }, []);

  const filteredGuilds = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return guilds.filter((guild) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        guild.name.toLowerCase().includes(normalizedQuery) ||
        guild.id.includes(normalizedQuery);

      if (!matchesQuery) {
        return false;
      }

      if (filter === "manageable") {
        return guild.manageable;
      }

      if (filter === "limited") {
        return guild.source === "fallback";
      }

      return true;
    });
  }, [filter, guilds, query]);

  const manageableCount = guilds.filter((guild) => guild.manageable).length;
  const discordCount = guilds.filter((guild) => hasAccess(guild.access, ACCESS.DISCORD)).length;
  const robloxCount = guilds.filter((guild) => hasAccess(guild.access, ACCESS.ROBLOX)).length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black px-4 pb-14 pt-10 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 -top-20 h-80 bg-linear-to-b from-cyan-500/18 via-blue-500/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-28 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <section className="pb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">CYNI Command</p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Guild Ops, Instantly
              </h1>
              <p className="mt-3 max-w-2xl text-base text-gray-300/85">
                Premium speed workflow: open server panels directly from each row with no intermediate selection step.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4 sm:text-base">
              <Metric label="Total" value={guilds.length} accent="text-cyan-300" />
              <Metric label="Manageable" value={manageableCount} accent="text-violet-300" />
              <Metric label="Discord" value={discordCount} accent="text-indigo-300" />
              <Metric label="Roblox" value={robloxCount} accent="text-emerald-300" />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search server name or ID"
              className="w-full rounded-full bg-white/5 px-5 py-3 text-sm text-white placeholder:text-gray-500 outline-none ring-1 ring-white/10 transition focus:ring-cyan-300/70"
            />

            <div className="inline-flex rounded-full bg-white/5 p-1 ring-1 ring-white/10 md:w-auto">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")} label="All" />
              <FilterButton
                active={filter === "manageable"}
                onClick={() => setFilter("manageable")}
                label="Manageable"
              />
              <FilterButton
                active={filter === "limited"}
                onClick={() => setFilter("limited")}
                label="Limited"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-4 rounded-full bg-red-500/15 px-4 py-2 text-sm text-red-200 ring-1 ring-red-400/30">
            {error}
          </div>
        )}

        <section className="mt-2">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-gray-500">
            <h2>Launch Servers</h2>
            <p>{filteredGuilds.length} visible</p>
          </div>

          {loading && (
            <div className="divide-y divide-white/8 rounded-3xl bg-white/3 px-4 ring-1 ring-white/10">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="h-24 animate-pulse"
                  style={{ animationDelay: `${index * 80}ms` }}
                />
              ))}
            </div>
          )}

          {!loading && filteredGuilds.length === 0 && (
            <div className="rounded-3xl bg-white/3 px-6 py-10 text-center text-sm text-gray-400 ring-1 ring-white/10">
              No guilds match your current search or filter.
            </div>
          )}

          {!loading && filteredGuilds.length > 0 && (
            <div className="divide-y divide-white/8 rounded-3xl bg-white/3 px-4 ring-1 ring-white/10 sm:px-6">
              {filteredGuilds.map((guild, index) => {
                const managerAccess = hasAccess(guild.access, ACCESS.MANAGER);
                const discordAccess = hasAccess(guild.access, ACCESS.DISCORD);
                const robloxAccess = hasAccess(guild.access, ACCESS.ROBLOX);

                return (
                  <article
                    key={guild.id}
                    className="grid gap-4 py-5 transition duration-300 hover:rounded-3xl hover:bg-white/3 sm:grid-cols-[1fr_auto] sm:items-center"
                    style={{ animationDelay: `${index * 35}ms` }}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <Image
                        src={
                          guild.icon
                            ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                            : "/images/cyni-rev.png"
                        }
                        alt={guild.name}
                        width={52}
                        height={52}
                        className="rounded-2xl object-cover ring-1 ring-white/20"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-white">{guild.name}</p>
                        <p className="truncate text-xs text-gray-400">{guild.id}</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Pill label="Manager" enabled={managerAccess} />
                          <Pill label="Discord" enabled={discordAccess} />
                          <Pill label="Roblox" enabled={robloxAccess} />
                          {guild.source === "fallback" && <Pill label="Limited" enabled={false} />}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      {managerAccess && <ActionButton label="Dashboard" variant="primary" />}
                      {discordAccess && <ActionButton label="Discord" variant="discord" />}
                      {robloxAccess && <ActionButton label="Roblox" variant="roblox" />}
                      {!managerAccess && !discordAccess && !robloxAccess && (
                        <span className="px-2 py-1 text-xs text-gray-500">No panel access</span>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent}`}>{value}</p>
    </div>
  );
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-medium transition ${
        active
          ? "bg-cyan-400/20 text-cyan-200"
          : "text-gray-400 hover:bg-white/10 hover:text-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

function Pill({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <span
      className={`rounded-md border px-2 py-1 text-[11px] ${
        enabled
          ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
          : "border-white/10 bg-white/5 text-gray-400"
      }`}
    >
      {label}
    </span>
  );
}

function ActionButton({
  label,
  variant,
}: {
  label: string;
  variant: "primary" | "discord" | "roblox";
}) {
  const styles = {
    primary: "bg-linear-to-r from-cyan-500 to-violet-600 text-white hover:opacity-90",
    discord: "bg-indigo-500/20 text-indigo-200 hover:bg-indigo-500/30 ring-1 ring-indigo-400/25",
    roblox: "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30 ring-1 ring-emerald-400/25",
  };

  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${styles[variant]}`}
    >
      {label}
    </button>
  );
}