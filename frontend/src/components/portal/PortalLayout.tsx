import { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
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
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-sidebar">
        <div className="px-6 py-6 flex items-center gap-3">
          <div className={cn("h-9 w-9 rounded-xl bg-gradient-to-br shadow-glow flex items-center justify-center", accentMap[accent])}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight">SahyogX AI</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{brandTag}</div>
          </div>
        </div>
        <nav className="px-3 py-2 flex-1 space-y-1">
          {nav.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-foreground/[0.04] text-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03]"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-accent")} />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4">
          <div className="rounded-xl glass p-4">
            <div className="text-xs font-semibold">Need help?</div>
            <div className="text-[11px] text-muted-foreground mt-1">Our team responds in &lt;5 min</div>
            <button className="mt-3 w-full text-xs font-medium px-3 py-2 rounded-md bg-foreground text-background hover:opacity-90 transition">
              Contact support
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-background/70 backdrop-blur-xl sticky top-0 z-30 flex items-center px-4 lg:px-8 gap-4">
          <div className="lg:hidden flex items-center gap-2">
            <div className={cn("h-7 w-7 rounded-lg bg-gradient-to-br", accentMap[accent])} />
            <span className="font-semibold">SahyogX</span>
          </div>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
            <div className="flex items-center gap-2 w-full px-3 py-2 rounded-lg bg-muted text-sm text-muted-foreground">
              <Search className="h-4 w-4" />
              <input
                placeholder={`Search ${brand.toLowerCase()}…`}
                className="bg-transparent outline-none flex-1 text-foreground placeholder:text-muted-foreground"
              />
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border bg-background">⌘K</kbd>
            </div>
          </div>
          <div className="flex-1" />
          <button className="h-9 w-9 rounded-lg hover:bg-muted flex items-center justify-center relative">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[oklch(0.68_0.2_20)]" />
          </button>
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline">Switch role</Link>
          <div className={cn("h-9 w-9 rounded-full bg-gradient-to-br ring-2 ring-background shadow-soft", accentMap[accent])} />
        </header>
        <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1.5 max-w-xl">{subtitle}</p>}
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
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:shadow-elevated transition">
      <div className="flex items-center justify-between">
        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", toneMap[tone])}>
          <Icon className="h-5 w-5" />
        </div>
        {delta && <span className="text-xs font-medium text-[oklch(0.5_0.16_160)]">{delta}</span>}
      </div>
      <div className="mt-4 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border p-6 shadow-soft", className)}>
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
    blue: "bg-[oklch(0.62_0.18_255_/_0.1)] text-[oklch(0.5_0.2_265)]",
    emerald: "bg-[oklch(0.7_0.16_160_/_0.12)] text-[oklch(0.45_0.16_160)]",
    amber: "bg-[oklch(0.82_0.16_75_/_0.2)] text-[oklch(0.5_0.18_60)]",
    rose: "bg-[oklch(0.68_0.2_20_/_0.12)] text-[oklch(0.5_0.22_20)]",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", map[tone])}>
      {children}
    </span>
  );
}