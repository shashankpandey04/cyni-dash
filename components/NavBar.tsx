"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const { data: session, status } = useSession();

  const loading = status === "loading";
  const user = session?.user;

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-6">
      <nav className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/70 backdrop-blur-xl px-6 py-4 shadow-2xl shadow-black/30">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/images/cyni-rev.png"
              alt="CYNI"
              width={40}
              height={40}
              priority
              className="transition-transform duration-300 group-hover:scale-105"
            />

            <span className="text-xl font-bold tracking-wide">CYNI</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>

            <NavLink href="/pricing" pathname={pathname}>
              Pricing
            </NavLink>

            <NavLink href="/docs" pathname={pathname}>
              Documentation
            </NavLink>

            {user && (
              <NavLink href="/dashboard" pathname={pathname}>
                Dashboard
              </NavLink>
            )}
          </div>

          {/* Right Side */}
          {!loading && (
            <div className="flex items-center gap-4">
              {!user ? (
                <>
                  <button
                    onClick={() => signIn("discord")}
                    className="
                      rounded-xl
                      bg-cyan-500
                      text-black
                      font-semibold
                      px-5
                      py-2.5
                      transition
                      hover:bg-cyan-400
                      shadow-lg
                      shadow-cyan-500/20
                    "
                  >
                    Login
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="
                      hidden
                      sm:flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-cyan-500/20
                      bg-cyan-500/10
                      px-4
                      py-2
                      text-cyan-400
                      hover:bg-cyan-500/15
                      transition
                    "
                  >
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>

                  {user.avatar && (
                    <Image
                      src={user.avatar}
                      alt={user.displayName ?? user.username ?? "User"}
                      width={40}
                      height={40}
                      className="
                        rounded-full
                        border
                        border-cyan-500/20
                        object-cover
                      "
                    />
                  )}

                  <button
                    onClick={() => signOut()}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-white/10
                      px-4
                      py-2
                      text-gray-400
                      transition
                      hover:text-red-400
                      hover:border-red-500/20
                    "
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function NavLink({
  href,
  pathname,
  children,
}: {
  href: string;
  pathname: string;
  children: React.ReactNode;
}) {
  const active =
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`
        relative
        text-sm
        font-medium
        transition
        ${active ? "text-cyan-400" : "text-gray-400 hover:text-white"}
      `}
    >
      {children}

      {active && (
        <span
          className="
            absolute
            -bottom-2
            left-0
            h-px
            w-full
            bg-cyan-400
          "
        />
      )}
    </Link>
  );
}
