"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Shield, Gamepad2, Settings } from "lucide-react";

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

export default function GuildOverviewPage() {
  const { guildId } = useParams();

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
      <div className="py-20">
        <p className="text-sm text-gray-500">Loading community...</p>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="py-20">
        <h1 className="text-xl font-medium">Community not found</h1>

        <p className="mt-2 text-gray-500">
          The requested community could not be loaded.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-5">
        <Image
          src={
            guild.icon
              ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`
              : "/images/cyni-rev.png"
          }
          alt={guild.name}
          width={72}
          height={72}
          className="
            rounded-2xl
            border
            border-white/10
            object-cover
          "
        />

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {guild.name}
          </h1>

          <p className="mt-1 text-sm text-gray-500">Community Overview</p>
        </div>
      </div>

      {/* Overview */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <OverviewCard
          title="Discord"
          value={
            hasAccess(guild.access, ACCESS.DISCORD) ? "Enabled" : "Unavailable"
          }
          icon={<Shield size={18} />}
        />

        <OverviewCard
          title="Roblox"
          value={
            hasAccess(guild.access, ACCESS.ROBLOX) ? "Enabled" : "Unavailable"
          }
          icon={<Gamepad2 size={18} />}
        />

        <OverviewCard
          title="Management"
          value={guild.manageable ? "Full Access" : "Limited Access"}
          icon={<Settings size={18} />}
        />
      </div>

      {/* Info */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/2 p-6">
        <h2 className="font-medium">Community Information</h2>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Guild ID</span>

            <span className="font-mono text-gray-300">{guild.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Access Level</span>

            <span className="text-gray-300">
              {guild.manageable ? "Manage Access" : "View Access"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-white/2
        p-5
      "
    >
      <div className="flex items-center gap-2 text-cyan-400">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <p className="mt-4 text-lg font-medium">{value}</p>
    </div>
  );
}
