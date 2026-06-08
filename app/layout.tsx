import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/NavBar";
import Providers from "./providers";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CYNI",
    template: "%s | CYNI",
  },
  description:
    "Infrastructure-grade moderation and automation for serious Discord communities.",
  icons: {
    icon: "/images/cyni-rev.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          bg-black
          text-white
          antialiased
        `}
      >
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
