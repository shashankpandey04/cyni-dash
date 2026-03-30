"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
};

export default function GuildPage() {
  const { guildId } = useParams();
  const router = useRouter();

  const [guild, setGuild] = useState<Guild | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuild = async () => {
      try {
        const res = await fetch("/api/guilds");
        const data = await res.json();

        if (!res.ok) return;

        const found = data.find((g: Guild) => g.id === guildId);
        setGuild(found || null);
      } catch {
        setGuild(null);
      } finally {
        setLoading(false);
      }
    };

    loadGuild();
  }, [guildId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Guild not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-sm font-medium hover:bg-purple-600/30 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black px-4 pb-16 pt-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-linear-to-b from-purple-600/20 via-purple-600/10 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Servers
        </button>

        <div className="mb-12">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-shrink-0">
              <Image
                src={
                  guild.icon
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
                    : "/images/cyni-rev.png"
                }
                alt={guild.name}
                width={96}
                height={96}
                className="aspect-square rounded-2xl border border-gray-800 object-cover shadow-lg shadow-purple-600/10"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-baseline gap-3 mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-purple-400">Guild</p>
                <div className="h-px flex-1 bg-gradient-to-r from-purple-600/30 to-transparent" />
              </div>
              
              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-3">
                {guild.name}
              </h1>
              
              <p className="text-lg text-gray-400">
                Configure and manage this server's features and settings.
              </p>

              <p className="text-xs text-gray-500 font-mono mt-4">ID: {guild.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hasAccess(guild.access, ACCESS.MANAGER) && (
            <PanelCard
              title="Settings"
              desc="Configure core features and permissions"
              icon="⚙️"
              onClick={() => router.push(`/dashboard/${guild.id}/settings`)}
              index={0}
            />
          )}

          {hasAccess(guild.access, ACCESS.DISCORD) && (
            <PanelCard
              title="Discord Panel"
              desc="Moderation, automod, logs & more"
              icon="🛡️"
              onClick={() => router.push(`/dashboard/${guild.id}/panel/discord`)}
              index={1}
            />
          )}

          {hasAccess(guild.access, ACCESS.ROBLOX) && (
            <PanelCard
              title="Roblox Panel"
              desc="Verification, linking & roles"
              icon="🎮"
              onClick={() => router.push(`/dashboard/${guild.id}/panel/roblox`)}
              index={2}
            />
          )}

          {!guild.manageable && (
            <div className="col-span-full rounded-2xl border border-gray-800/50 bg-gray-900/30 p-8 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-gray-400 text-sm">
                You don't have permission to manage this server. Contact a server administrator for access.
              </p>
            </div>
          )}
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

function PanelCard({
  title,
  desc,
  icon,
  onClick,
  index,
}: {
  title: string;
  desc: string;
  icon: string;
  onClick: () => void;
  index: number;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-gray-800 bg-gray-950/50 p-6 cursor-pointer transition-all duration-300 hover:border-purple-600/50 hover:bg-gray-900/80 hover:shadow-lg hover:shadow-purple-600/10 hover:-translate-y-1"
      style={{ animation: `slideUp 0.5s ease-out ${index * 50}ms both` }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative">
        <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h2>

        <p className="text-sm text-gray-400 mb-4">
          {desc}
        </p>
        
        <div className="flex items-center gap-2 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span>Access</span>
          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}