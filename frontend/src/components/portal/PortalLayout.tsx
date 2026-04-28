import { ReactNode, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/hooks/lib/utils";
import { Bell, Search, Sparkles } from "lucide-react";

export type NavItem = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
};

type Props = {
  brand: string;
  brandTag: string;
  accent: "blue" | "emerald" | "amber";
  nav: NavItem[];
  children: ReactNode;
};

const accentMap = {
  blue: "from-teal-500 to-cyan-600",
  emerald: "from-teal-500 to-emerald-600",
  amber: "from-teal-500 to-yellow-500",
};

const accentBg = {
  blue: "bg-teal-500",
  emerald: "bg-teal-500",
  amber: "bg-teal-500",
};

export function PortalLayout({ brand, brandTag, accent, nav, children }: Props) {
  const location = useLocation();
  const [showNotificationsPreview, setShowNotificationsPreview] = useState(false);
  return (
    <div className="min-h-screen flex w-full bg-[#080c14] text-slate-200">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-teal-500/10 bg-[#060a10]">
        <div className="px-5 py-6 flex items-center gap-3 border-b border-teal-500/10">
          <div className={cn("h-10 w-10 rounded-xl bg-gradient-to-br shadow-teal-glow flex items-center justify-center", accentMap[accent])}>
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide text-white">SahyogX</div>
            <div className="text-[10px] uppercase tracking-widest text-teal-500/60">{brandTag}</div>
          </div>
        </div>
        <div className="px-5 pt-5">
          <div className="rounded-xl bg-[#0e1520] border border-teal-500/10 px-4 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-500/60">
              Active workspace
            </div>
            <div className="mt-1 text-sm font-bold text-white tracking-wide">{brand}</div>
            <div className="mt-1.5 text-xs text-slate-500">
              Live operational view with synchronized task status.
            </div>
          </div>
        </div>
        <nav className="px-3 py-4 flex-1 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "border-l-2 border-teal-400 bg-teal-500/10 text-teal-400"
                    : "text-slate-400 hover:text-teal-400 hover:bg-teal-500/5"
                )}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    active
                      ? "bg-teal-500/20 text-teal-400"
                      : "bg-slate-800 text-slate-400 group-hover:text-teal-400"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
                {active && <span className="ml-auto h-2 w-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(0,200,180,0.6)]" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-xl bg-[#0e1520] border border-teal-500/10 p-4">
            <div className="text-xs font-semibold text-white">Need help?</div>
            <div className="mt-1.5 text-[11px] text-slate-500">
              Support stays available during operations.
            </div>
            <button
              disabled
              className="mt-4 w-full rounded-xl bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-400 border border-slate-700 opacity-50"
            >
              Support Coming Soon
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-teal-500/10 bg-gradient-to-r from-teal-500/5 to-blue-500/5 px-4 lg:px-6">
          <div className="lg:hidden flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-xl bg-gradient-to-br shadow-teal-glow", accentMap[accent])} />
            <span className="font-bold text-white">SahyogX</span>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
            <div className="flex items-center gap-2 w-full rounded-xl border border-teal-500/10 bg-[#0e1520] px-3.5 py-2.5 text-sm text-slate-400">
              <Search className="h-4 w-4" />
              <input
                placeholder={`Search ${brand.toLowerCase()}...`}
                className="bg-transparent outline-none flex-1 text-slate-200 placeholder:text-slate-500"
              />
              <kbd className="rounded-md border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-500">Ctrl K</kbd>
            </div>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setShowNotificationsPreview(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-teal-500/10 bg-[#0e1520] transition hover:border-teal-500/30"
          >
            <Bell className="h-4 w-4 text-slate-400" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(0,200,180,0.8)]" />
          </button>
          <Link to="/" className="hidden rounded-full border border-teal-500/10 bg-[#0e1520] px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-teal-400 hover:border-teal-500/30 sm:inline">
            Switch role
          </Link>
          <div className={cn("h-9 w-9 rounded-full bg-gradient-to-br ring-2 ring-slate-800", accentMap[accent])} />
        </header>
        <main className="relative flex-1 w-full max-w-[1440px] mx-auto p-4 lg:p-6">
          <div className="relative">{children}</div>
        </main>
      </div>

      {showNotificationsPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0e1520] border border-teal-500/10 p-6 shadow-elevated">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-500/60">
                  Preview
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Notifications Center
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Assignment updates, request movement, and volunteer task events.
                </p>
              </div>
              <button
                onClick={() => setShowNotificationsPreview(false)}
                className="rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-700"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Request status changes from Raised to Under Review",
                "Volunteer task acceptance and updates",
                "Critical queue items needing attention",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-teal-500/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-[#0e1520] border border-teal-500/10 px-5 py-5 sm:flex-row sm:items-end sm:justify-between lg:px-6 lg:py-6">
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-teal-500/60">Operational view</div>
        <h1 className="mt-1 text-2xl font-bold text-white tracking-wide lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  delta?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "blue" | "emerald" | "amber" | "rose";
}) {
  const toneMap: Record<string, string> = {
    blue: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    emerald: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    amber: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-[#0e1520] border border-teal-500/10 p-5 transition-all duration-200 hover:border-teal-500/25 stat-card-glow">
      <div className="flex items-center justify-between">
        <div className={cn("relative z-10 h-10 w-10 rounded-xl flex items-center justify-center border", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && <span className="relative z-10 rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] font-semibold text-teal-400 shadow-teal-glow">{delta}</span>}
      </div>
      <div className="relative z-10 mt-4 text-3xl font-bold text-white">{value}</div>
      <div className="relative z-10 mt-1 text-xs uppercase tracking-widest text-slate-500">{label}</div>
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-[#0e1520] border border-teal-500/10 p-6 transition-all duration-200 hover:border-teal-500/25", className)}>
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "emerald" | "amber" | "rose" | "neutral";
}) {
  const map: Record<string, string> = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    emerald: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    amber: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    rose: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    neutral: "bg-slate-700/50 text-slate-400 border-slate-600/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold shadow-soft", map[tone])}>
      {children}
    </span>
  );
}