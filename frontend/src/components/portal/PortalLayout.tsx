import { ReactNode, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "../../lib/utils";
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
  blue: "from-[oklch(0.62_0.18_255)] to-[oklch(0.55_0.2_270)]",
  emerald: "from-[oklch(0.7_0.16_160)] to-[oklch(0.62_0.18_255)]",
  amber: "from-[oklch(0.85_0.17_80)] to-[oklch(0.7_0.2_40)]",
};

export function PortalLayout({ brand, brandTag, accent, nav, children }: Props) {
  const location = useLocation();
  const [showNotificationsPreview, setShowNotificationsPreview] = useState(false);
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground ambient-gradient">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-border/80 bg-sidebar/92 backdrop-blur-2xl">
        <div className="px-6 py-7 flex items-center gap-3 border-b border-border/70">
          <div className={cn("h-11 w-11 rounded-2xl bg-gradient-to-br shadow-glow flex items-center justify-center", accentMap[accent])}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">SahyogX</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{brandTag}</div>
          </div>
        </div>
        <div className="px-6 pt-5">
          <div className="rounded-2xl panel-premium px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Active workspace
            </div>
            <div className="mt-1 text-sm font-semibold tracking-tight">{brand}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Live operational view with synchronized task status and response flow.
            </div>
          </div>
        </div>
        <nav className="px-3 py-4 flex-1 space-y-1.5">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200",
                  active
                    ? "panel-premium-dark text-foreground shadow-elevated"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/65"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                    active
                      ? "bg-white text-accent shadow-soft"
                      : "bg-background/80 text-muted-foreground group-hover:text-accent"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {item.label}
                {active && <span className="ml-auto h-2 w-2 rounded-full bg-accent shadow-glow" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-2xl panel-premium p-4">
            <div className="text-xs font-semibold tracking-tight">Need help?</div>
            <div className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Support stays available during demos and responds within minutes.
            </div>
            <button
              disabled
              className="mt-4 w-full rounded-xl bg-foreground/85 px-3 py-2.5 text-xs font-medium text-background shadow-soft transition opacity-70"
            >
              Support Desk Coming Soon
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-18 items-center gap-4 border-b border-border/70 bg-background/78 px-4 backdrop-blur-2xl lg:px-8">
          <div className="lg:hidden flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-xl bg-gradient-to-br shadow-soft", accentMap[accent])} />
            <span className="font-semibold">SahyogX</span>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-lg">
            <div className="flex items-center gap-2 w-full rounded-2xl border border-border/70 bg-white/75 px-3.5 py-2.5 text-sm text-muted-foreground shadow-soft backdrop-blur">
              <Search className="h-4 w-4" />
              <input
                placeholder={`Search ${brand.toLowerCase()}...`}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
              <kbd className="rounded-lg border border-border bg-background px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
            </div>
          </div>
          <div className="flex-1" />
          <button
            onClick={() => setShowNotificationsPreview(true)}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-white/75 shadow-soft transition hover:-translate-y-0.5 hover:bg-white"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.2_20)]" />
          </button>
          <Link to="/" className="hidden rounded-full border border-border/70 bg-white/75 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-soft transition hover:-translate-y-0.5 hover:text-foreground sm:inline">
            Switch role
          </Link>
          <div className={cn("h-10 w-10 rounded-full bg-gradient-to-br ring-2 ring-background shadow-elevated", accentMap[accent])} />
        </header>
        <main className="relative flex-1 w-full max-w-[1440px] mx-auto p-4 lg:p-8">
          <div className="pointer-events-none absolute inset-x-8 top-0 h-40 rounded-b-[3rem] bg-gradient-to-b from-white/55 to-transparent blur-3xl" />
          <div className="relative">{children}</div>
        </main>
      </div>

      {showNotificationsPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(0.18_0.05_265_/_0.28)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] panel-premium p-6 shadow-elevated">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Preview
                </div>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">
                  Notifications Center
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  This preview will later surface assignment updates, request movement, and volunteer task events in one place.
                </p>
              </div>
              <button
                onClick={() => setShowNotificationsPreview(false)}
                className="rounded-xl border border-border/80 bg-background/90 px-3 py-1.5 text-xs font-medium shadow-soft transition hover:bg-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Request status changes from Raised to Under Review",
                "Volunteer task acceptance and completion updates",
                "Critical queue items needing NGO attention",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-white/65 px-4 py-3 text-sm text-muted-foreground shadow-soft"
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
    <div className="mb-8 flex flex-col gap-4 rounded-[1.75rem] panel-premium px-5 py-5 sm:flex-row sm:items-end sm:justify-between lg:px-6 lg:py-6">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Operational view</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight lg:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
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
    blue: "bg-[oklch(0.62_0.18_255_/_0.1)] text-[oklch(0.55_0.2_270)]",
    emerald: "bg-[oklch(0.7_0.16_160_/_0.12)] text-[oklch(0.5_0.16_160)]",
    amber: "bg-[oklch(0.82_0.16_75_/_0.18)] text-[oklch(0.55_0.18_60)]",
    rose: "bg-[oklch(0.68_0.2_20_/_0.12)] text-[oklch(0.55_0.22_20)]",
  };
  return (
    <div className="group relative overflow-hidden rounded-[1.6rem] panel-premium p-5 transition duration-200 hover:-translate-y-1 hover:shadow-elevated">
      <div className="pointer-events-none absolute inset-x-6 top-0 h-16 rounded-b-full bg-gradient-to-b from-white/80 to-transparent opacity-90" />
      <div className="flex items-center justify-between">
        <div className={cn("relative z-10 h-11 w-11 rounded-2xl flex items-center justify-center shadow-soft", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && <span className="relative z-10 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-[oklch(0.5_0.16_160)] shadow-soft">{delta}</span>}
      </div>
      <div className="relative z-10 mt-5 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="relative z-10 mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">{label}</div>
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-[1.75rem] panel-premium p-6", className)}>
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
    blue: "bg-[oklch(0.62_0.18_255_/_0.12)] text-[oklch(0.5_0.2_265)] border-[oklch(0.62_0.18_255_/_0.18)]",
    emerald: "bg-[oklch(0.7_0.16_160_/_0.14)] text-[oklch(0.45_0.16_160)] border-[oklch(0.7_0.16_160_/_0.18)]",
    amber: "bg-[oklch(0.82_0.16_75_/_0.18)] text-[oklch(0.5_0.18_60)] border-[oklch(0.82_0.16_75_/_0.24)]",
    rose: "bg-[oklch(0.68_0.2_20_/_0.14)] text-[oklch(0.5_0.22_20)] border-[oklch(0.68_0.2_20_/_0.22)]",
    neutral: "bg-muted/80 text-muted-foreground border-border/80",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-soft", map[tone])}>
      {children}
    </span>
  );
}
