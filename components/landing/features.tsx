import {
  Shield,
  Bot,
  Ticket,
  Users,
  FileText,
  Gift,
  LucideIcon,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Advanced Moderation",
    description:
      "Powerful moderation workflows with role hierarchies, automations, infractions, and audit logging.",
  },
  {
    icon: Bot,
    title: "Automod Engine",
    description:
      "Real-time spam detection, anti-raid systems, content filtering, and custom rule enforcement.",
  },
  {
    icon: Ticket,
    title: "Ticket Infrastructure",
    description:
      "Structured support operations with transcripts, permissions, escalations, and analytics.",
  },
  {
    icon: Users,
    title: "Staff Management",
    description:
      "Track staff activity, manage leave requests, performance reports, and internal workflows.",
  },
  {
    icon: FileText,
    title: "Application System",
    description:
      "Custom application pipelines with reviews, approvals, notifications, and decision tracking.",
  },
  {
    icon: Gift,
    title: "Giveaway Engine",
    description:
      "Run verified giveaways with eligibility checks, automated draws, and fraud prevention.",
  },
];

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/2 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:bg-white/4 hover:-translate-y-1">
      <div className="absolute inset-0 bg-linear-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <Icon className="h-6 w-6 text-cyan-400" />
        </div>

        <h3 className="mb-3 text-lg font-semibold text-white">{title}</h3>

        <p className="text-sm leading-relaxed text-gray-400">{description}</p>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="absolute inset-0 bg-black" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,255,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-20 max-w-3xl text-center">
          <span className="mb-4 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-sm text-cyan-400">
            Platform Capabilities
          </span>

          <h2 className="mb-6 text-5xl font-bold tracking-tight text-white">
            Infrastructure for
            <span className="text-cyan-400"> Modern Communities</span>
          </h2>

          <p className="text-lg text-gray-400">
            CYNI provides the operational backbone for Discord communities,
            combining moderation, support, staff operations, and automation into
            a single platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
