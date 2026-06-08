"use client";

import Image from "next/image";
import FeaturesSection from "@/components/landing/features";

export default function Home() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        <video
          src="/videos/CYNI.mp4"
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          loop
          muted
        />

        <div className="absolute inset-0 bg-black/80" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.15),transparent_50%)]" />

        <div className="relative z-10 max-w-5xl">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
            Operate Your
            <span className="block text-cyan-400">Discord Community</span>
          </h1>

          <p className="mt-8 text-xl text-gray-400 max-w-3xl mx-auto">
            Moderation, support operations, staff management, automations, and
            analytics unified into a single platform built for scale.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center">
            <button className="bg-cyan-500 text-black hover:bg-cyan-400 transition px-8 py-4 rounded-xl font-semibold shadow-lg shadow-cyan-500/30">
              Add to Discord
            </button>

            <button className="border border-white/10 hover:border-cyan-500/30 hover:bg-white/5 transition px-8 py-4 rounded-xl">
              Explore Platform
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                value: "40K+",
                label: "Community Members",
              },
              {
                value: "300+",
                label: "Managed Servers",
              },
              {
                value: "10M+",
                label: "Actions Processed",
              },
              {
                value: "99.9%",
                label: "Platform Uptime",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/2 p-8 text-center"
              >
                <h2 className="text-5xl font-bold text-cyan-400">
                  {stat.value}
                </h2>

                <p className="mt-3 text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection />

      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400 mb-6">
              Dashboard
            </div>

            <h2 className="text-5xl font-bold mb-6">
              Operational Control Center
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Manage every aspect of your community from a centralized
              dashboard. Configure automations, monitor moderation activity,
              review applications, manage support tickets, and analyze server
              health in real time.
            </p>

            <div className="space-y-4 text-gray-300">
              <div>✓ Real-time configuration</div>
              <div>✓ Audit log visibility</div>
              <div>✓ Permission management</div>
              <div>✓ Community analytics</div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/2">
            <Image
              src="/images/dashboard.png"
              alt="CYNI Dashboard Preview"
              width={1600}
              height={900}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400 mb-6">
            Architecture
          </div>

          <h2 className="text-5xl font-bold mb-6">Built for Reliability</h2>

          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-16">
            Designed with fault tolerance, intelligent caching, real-time event
            processing, and scalable infrastructure to support growing
            communities.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Real-Time Events",
              "High Availability",
              "Audit Logging",
              "Role Security",
              "Automated Workflows",
              "Scalable Architecture",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/2 p-8"
              >
                <h3 className="font-semibold text-lg">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-6">
            Designed for Organized Communities
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed">
            Whether managing a roleplay server, gaming network, educational
            community, creator hub, or support organization, CYNI provides the
            operational tools needed to scale effectively.
          </p>
        </div>
      </section>

      <section className="py-32 border-t border-white/5 text-center px-6">
        <h2 className="text-5xl font-bold mb-6">
          Ready to Scale Your Community?
        </h2>

        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
          Join communities already using CYNI to streamline operations, automate
          workflows, and maintain structure at scale.
        </p>

        <button className="bg-cyan-500 text-black hover:bg-cyan-400 transition px-10 py-5 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/30">
          Add CYNI to Your Server
        </button>
      </section>
    </main>
  );
}
