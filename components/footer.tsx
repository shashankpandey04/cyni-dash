"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/cyni-rev.png"
                alt="CYNI"
                width={42}
                height={42}
              />

              <span className="text-xl font-bold">CYNI</span>
            </Link>

            <p className="mt-5 max-w-md text-gray-400 leading-relaxed">
              Infrastructure-grade moderation, automation, and operational
              tooling for modern Discord communities.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-sm text-gray-500">
                All systems operational
              </span>
            </div>
          </div>
          <div>
            <h3 className="mb-4 font-semibold text-white">Product</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link
                  href="/dashboard"
                  className="hover:text-cyan-400 transition"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/pricing"
                  className="hover:text-cyan-400 transition"
                >
                  Pricing
                </Link>
              </li>

              <li>
                <Link href="/docs" className="hover:text-cyan-400 transition">
                  Documentation
                </Link>
              </li>

              <li>
                <Link href="/status" className="hover:text-cyan-400 transition">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>

            <ul className="space-y-3 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-cyan-400 transition">
                  About
                </Link>
              </li>

              <li>
                <Link href="/terms" className="hover:text-cyan-400 transition">
                  Terms
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="hover:text-cyan-400 transition"
                >
                  Privacy
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-cyan-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-white/5 pt-8">
          <p className="text-sm text-gray-500">
            © 2023-26 CYNI. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-cyan-400 transition">
              Privacy
            </Link>

            <Link href="/terms" className="hover:text-cyan-400 transition">
              Terms
            </Link>

            <Link href="/status" className="hover:text-cyan-400 transition">
              Status
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
