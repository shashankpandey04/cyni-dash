"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Shield,
  Gamepad2,
  Settings,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

export default function GuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { guildId } = useParams();

  const [discordOpen, setDiscordOpen] = useState(true);
  const [robloxOpen, setRobloxOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="mx-auto flex max-w-7xl gap-10 px-6 py-32">
      <aside className="w-64 shrink-0">
        <div className="sticky top-28">
          <Link
            href={`/dashboard/${guildId}`}
            className={sidebarItem(pathname === `/dashboard/${guildId}`)}
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>

          <SidebarGroup
            title="Discord"
            icon={Shield}
            open={discordOpen}
            setOpen={setDiscordOpen}
          >
            <SidebarLink
              href={`/dashboard/${guildId}/panel/discord`}
              active={pathname === `/dashboard/${guildId}/panel/discord`}
            >
              Overview
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/panel/discord/moderation`}
              active={pathname.includes("moderation")}
            >
              Moderation
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/panel/discord/automod`}
              active={pathname.includes("automod")}
            >
              AutoMod
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/panel/discord/logs`}
              active={pathname.includes("logs")}
            >
              Logs
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup
            title="Roblox"
            icon={Gamepad2}
            open={robloxOpen}
            setOpen={setRobloxOpen}
          >
            <SidebarLink
              href={`/dashboard/${guildId}/panel/roblox`}
              active={pathname === `/dashboard/${guildId}/panel/roblox`}
            >
              Overview
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/panel/roblox/verification`}
              active={pathname.includes("verification")}
            >
              Verification
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/panel/roblox/ranks`}
              active={pathname.includes("ranks")}
            >
              Rank Sync
            </SidebarLink>
          </SidebarGroup>

          <SidebarGroup
            title="Settings"
            icon={Settings}
            open={settingsOpen}
            setOpen={setSettingsOpen}
          >
            <SidebarLink
              href={`/dashboard/${guildId}/settings`}
              active={pathname === `/dashboard/${guildId}/settings`}
            >
              General
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/settings/permissions`}
              active={pathname.includes("permissions")}
            >
              Permissions
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/settings/integrations`}
              active={pathname.includes("integrations")}
            >
              Integrations
            </SidebarLink>

            <SidebarLink
              href={`/dashboard/${guildId}/settings/security`}
              active={pathname.includes("security")}
            >
              Security
            </SidebarLink>
          </SidebarGroup>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function SidebarGroup({
  title,
  icon: Icon,
  open,
  setOpen,
  children,
}: {
  title: string;
  icon: LucideIcon;
  open: boolean;
  setOpen: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <button
        onClick={() => setOpen(!open)}
        className="
          flex
          w-full
          items-center
          justify-between
          rounded-xl
          px-4
          py-3
          text-gray-300
          hover:bg-white/3
        "
      >
        <div className="flex items-center gap-3">
          <Icon size={18} />
          {title}
        </div>

        <ChevronRight
          size={16}
          className={`
            transition-transform
            ${open ? "rotate-90" : ""}
          `}
        />
      </button>

      {open && <div className="ml-8 mt-1 space-y-1">{children}</div>}
    </div>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`
        block
        rounded-lg
        px-3
        py-2
        text-sm
        transition
        ${
          active ? "text-cyan-400 bg-white/3" : "text-gray-500 hover:text-white"
        }
      `}
    >
      {children}
    </Link>
  );
}

function sidebarItem(active: boolean) {
  return `
    flex
    items-center
    gap-3
    rounded-xl
    px-4
    py-3
    transition
    ${
      active
        ? "bg-white/[0.04] text-cyan-400"
        : "text-gray-400 hover:bg-white/[0.02] hover:text-white"
    }
  `;
}
