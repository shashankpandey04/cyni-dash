"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const user = session?.user;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-black/60 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/cyni-rev.png"
            alt="CYNI Logo"
            width={40}
            height={40}
            priority
          />
          <span className="text-xl font-semibold tracking-wide">
            CYNI
          </span>
        </Link>

        {!loading && (
          <div className="hidden md:flex items-center gap-8">

            <NavLink href="/" pathname={pathname}>
              Home
            </NavLink>

            {/* Show dashboard if logged in */}
            {user && (
              <NavLink href="/dashboard" pathname={pathname}>
                Dashboard
              </NavLink>
            )}

            {/* Not logged in */}
            {!user && (
              <button
                onClick={() => signIn("discord")}
                className="text-gray-300 hover:text-white transition font-medium"
              >
                Login
              </button>
            )}

            {/* Logged in */}
            {user && (
              <>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-red-400 transition font-medium"
                >
                  Logout
                </button>

                {user.avatar && (
                  <Image
                    src={user.avatar}
                    alt="Profile"
                    width={36}
                    height={36}
                    className="rounded-full border border-gray-700"
                  />
                )}
              </>
            )}
          </div>
        )}

      </div>
    </nav>
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
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`transition font-medium ${
        isActive
          ? "text-purple-500"
          : "text-gray-300 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}