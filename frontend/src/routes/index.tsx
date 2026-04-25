import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, ShieldCheck, Building2, Sparkles, Zap, MapPin, Activity } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const roles = [
  {
    title: "Continue as Citizen",
    desc: "Raise an emergency request and get matched in seconds.",
    icon: ShieldCheck,
    to: "/citizen",
    gradient: "from-[oklch(0.85_0.17_80)] to-[oklch(0.7_0.2_40)]",
    accent: "amber",
  },
  {
    title: "Continue as Volunteer",
    desc: "Find nearby tasks that match your skills and time.",
    icon: HeartHandshake,
    to: "/volunteer",
    gradient: "from-[oklch(0.7_0.16_160)] to-[oklch(0.62_0.18_255)]",
    accent: "emerald",
  },
  {
    title: "Continue as NGO",
    desc: "Coordinate relief with realtime allocation intelligence.",
    icon: Building2,
    to: "/ngo",
    gradient: "from-[oklch(0.62_0.18_255)] to-[oklch(0.4_0.18_280)]",
    accent: "blue",
  },
] as const;

function Index() {
  return (
    <div className="min-h-screen gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">SahyogX <span className="text-muted-foreground font-normal">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a className="hover:text-foreground transition" href="#how">How it works</a>
          <a className="hover:text-foreground transition" href="#impact">Impact</a>
          <a className="hover:text-foreground transition" href="#partners">Partners</a>
        </div>
        <Link to="/ngo" className="text-sm font-medium px-4 py-2 rounded-lg bg-foreground text-background hover:opacity-90 transition">
          Open command center
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16 lg:pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.16_160)] animate-pulse" />
          Live in 14 cities · 2,847 volunteers active now
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          The right help, in the <span className="text-gradient-brand">right place</span>, in seconds.
        </h1>
        <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
          SahyogX AI orchestrates citizens, volunteers and NGOs into one intelligent relief network — matching every request with the closest, most capable responder.
        </p>

        {/* Role cards */}
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 text-left">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.to}
                to={r.to}
                className="group relative rounded-3xl p-6 bg-card border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1"
              >
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-glow mb-5`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="font-semibold text-lg tracking-tight">{r.title}</div>
                <p className="text-sm text-muted-foreground mt-1.5">{r.desc}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-foreground gap-1 opacity-70 group-hover:opacity-100 transition">
                  Enter portal <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Feature strip */}
      <section id="how" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pb-24">
        <div className="rounded-3xl glass p-8 lg:p-12 grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Sub-second matching", desc: "AI ranks responders by distance, skill, and availability." },
            { icon: MapPin, title: "Underserved alerts", desc: "Spot coverage gaps before they become crises." },
            { icon: Activity, title: "Outcome analytics", desc: "Track response time, accuracy and impact in realtime." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <Icon className="h-5 w-5 text-accent mb-3" />
              <div className="font-semibold tracking-tight">{title}</div>
              <p className="text-sm text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center text-xs text-muted-foreground mt-10">
          © {new Date().getFullYear()} SahyogX AI · Built for humanitarian coordination
        </div>
      </section>
    </div>
  );
}
