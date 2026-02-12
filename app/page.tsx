import FooterYear from "@/components/FooterYear";

export default function Home() {
  return (
    <main className="bg-black text-white">

      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center text-center px-6">
        <video
          src="/videos/CYNI.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            CYNI
          </h1>

          <p className="mt-6 text-xl text-gray-300">
            Infrastructure-grade moderation and automation  
            for serious Discord communities.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-purple-600 hover:bg-purple-700 transition px-8 py-4 rounded-xl font-semibold shadow-lg shadow-purple-600/30">
              Add to Discord
            </button>

            <button className="border border-gray-700 hover:bg-gray-900 transition px-8 py-4 rounded-xl">
              View Dashboard
            </button>
          </div>
        </div>
      </section>
      <section className="py-24 border-t border-gray-900">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center px-6">

          <div>
            <h2 className="text-5xl font-bold text-purple-500">10K+</h2>
            <p className="text-gray-400 mt-3">Active Users</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-purple-500">200+</h2>
            <p className="text-gray-400 mt-3">Servers</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-purple-500">50+</h2>
            <p className="text-gray-400 mt-3">Commands</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-purple-500">99.9%</h2>
            <p className="text-gray-400 mt-3">Uptime</p>
          </div>

        </div>
      </section>

      <section className="py-32 bg-linear-to-b from-black to-gray-950">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-6">
            Built for Structured Communities
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-20">
            CYNI isn’t a casual utility bot. It’s operational infrastructure
            for growing and managing Discord ecosystems.
          </p>

          <div className="grid md:grid-cols-3 gap-10 text-left">

            <Feature 
              title="Advanced Moderation"
              desc="20+ moderation tools with smart automations, role hierarchies, and granular permissions."
            />

            <Feature 
              title="Automod Engine"
              desc="Spam detection, anti-raid protection, link filtering, and customizable rule systems."
            />

            <Feature 
              title="Ticket System"
              desc="Fully structured support channels with logging, transcripts, and permission control."
            />

            <Feature 
              title="Staff Management"
              desc="Infraction tracking, activity logs, leave of absence management, and reporting."
            />

            <Feature 
              title="Application System"
              desc="Custom forms with automated review workflows and staff notifications."
            />

            <Feature 
              title="Giveaway Engine"
              desc="Automated giveaway hosting with fair winner selection and entry validation."
            />

          </div>
        </div>
      </section>

      <section className="py-32 border-t border-gray-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

          <div>
            <h2 className="text-4xl font-bold mb-6">
              Powerful Web Dashboard
            </h2>

            <p className="text-gray-400 mb-6">
              Configure moderation, automations, logs, and community workflows
              without touching a command. Real-time control with enterprise-level stability.
            </p>

            <ul className="space-y-3 text-gray-300">
              <li>• Real-time configuration</li>
              <li>• Audit log visibility</li>
              <li>• Permission control</li>
              <li>• Server analytics</li>
            </ul>
          </div>

          <div className="bg-gray-900 h-80 rounded-2xl border border-gray-800 flex items-center justify-center text-gray-500">
            Dashboard Preview
          </div>

        </div>
      </section>

      <section className="py-32 bg-gray-950 border-t border-gray-900 text-center px-6">

        <h2 className="text-4xl font-bold mb-8">
          Built for Roleplay & Structured Communities
        </h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          Seamless PRC integration and scalable architecture designed for
          police roleplay communities and high-organization servers.
        </p>

      </section>

      <section className="py-32 text-center border-t border-gray-900">

        <h2 className="text-4xl font-bold mb-6">
          Upgrade Your Server Infrastructure
        </h2>

        <p className="text-gray-400 mb-10">
          CYNI is built for communities that operate at scale.
        </p>

        <button className="bg-purple-600 hover:bg-purple-700 transition px-10 py-5 rounded-xl font-semibold text-lg shadow-lg shadow-purple-600/30">
          Add CYNI to Your Server
        </button>

      </section>


      <footer className="py-10 border-t border-gray-900 text-center text-gray-500 text-sm">
        <FooterYear />
      </footer>

    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-purple-500 transition">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}
