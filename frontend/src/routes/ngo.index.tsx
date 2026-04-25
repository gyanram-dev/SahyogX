import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard, Card, Badge } from "@/components/portal/PortalLayout";
import { AlertTriangle, Users, Activity, Sparkles, MapPin, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/ngo/")({
  head: () => ({ meta: [{ title: "Dashboard — NGO Command Center" }] }),
  component: NgoDashboard,
});

function NgoDashboard() {
  return (
    <>
      <PageHeader
        title="Command Center"
        subtitle="Live coordination across your operating zones."
        action={
          <button className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-medium shadow-soft">
            + New mission
          </button>
        }
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Open requests" value="38" delta="+12" icon={AlertTriangle} tone="rose" />
        <StatCard label="Active volunteers" value="214" delta="+18" icon={Users} tone="emerald" />
        <StatCard label="Avg. response" value="9m 24s" delta="-1m 12s" icon={Activity} tone="blue" />
        <StatCard label="Match accuracy" value="93.4%" delta="+1.2%" icon={TrendingUp} tone="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live map */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold tracking-tight">Live operations map</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Realtime requests · volunteers · zones</p>
            </div>
            <Badge tone="emerald">● Live</Badge>
          </div>
          <div className="relative h-80 mx-6 mb-6 rounded-xl overflow-hidden border border-border bg-[oklch(0.97_0.01_250)]">
            <div className="absolute inset-0 grid-bg opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.62_0.18_255_/_0.08)] to-transparent" />
            {/* Pins */}
            {[
              { x: "20%", y: "30%", c: "rose" },
              { x: "55%", y: "55%", c: "emerald" },
              { x: "70%", y: "25%", c: "amber" },
              { x: "35%", y: "70%", c: "rose" },
              { x: "80%", y: "65%", c: "blue" },
            ].map((p, i) => (
              <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
                <span className={`absolute -inset-3 rounded-full animate-ping ${
                  p.c === "rose" ? "bg-[oklch(0.68_0.2_20_/_0.3)]" :
                  p.c === "emerald" ? "bg-[oklch(0.7_0.16_160_/_0.3)]" :
                  p.c === "amber" ? "bg-[oklch(0.82_0.16_75_/_0.3)]" :
                  "bg-[oklch(0.62_0.18_255_/_0.3)]"
                }`} />
                <span className={`relative block h-3 w-3 rounded-full ring-2 ring-white shadow-elevated ${
                  p.c === "rose" ? "bg-[oklch(0.6_0.22_20)]" :
                  p.c === "emerald" ? "bg-[oklch(0.55_0.16_160)]" :
                  p.c === "amber" ? "bg-[oklch(0.7_0.18_60)]" :
                  "bg-[oklch(0.55_0.2_265)]"
                }`} />
              </div>
            ))}
            <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 text-[11px] flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[oklch(0.6_0.22_20)]" /> Critical</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[oklch(0.7_0.18_60)]" /> High</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[oklch(0.55_0.16_160)]" /> Resolved</span>
            </div>
          </div>
        </Card>

        {/* AI rec */}
        <Card>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold tracking-tight">AI recommendations</h3>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { t: "Redirect 4 volunteers from Zone A → Zone C", desc: "Coverage gap detected", tone: "amber" as const },
              { t: "Open emergency shelter near MG Road", desc: "32 displaced, capacity full", tone: "rose" as const },
              { t: "Restock medkits at Clinic 7", desc: "Predicted shortfall in 6 hrs", tone: "blue" as const },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-border hover:bg-muted/40 transition">
                <div className="flex items-start gap-2">
                  <Badge tone={r.tone}>AI</Badge>
                  <div className="text-sm font-medium leading-snug">{r.t}</div>
                </div>
                <div className="text-xs text-muted-foreground mt-1.5 ml-1">{r.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h3 className="font-semibold tracking-tight">Underserved alerts</h3>
          <div className="mt-4 space-y-3">
            {[
              { z: "North Sector — Ward 12", g: "No volunteer in 2.4 km", sev: "rose" as const },
              { z: "Coastal Block — Ward 7", g: "Slow response (avg 28m)", sev: "amber" as const },
              { z: "Industrial Belt — Ward 4", g: "Skills gap: medical", sev: "amber" as const },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{a.z}</div>
                  <div className="text-xs text-muted-foreground">{a.g}</div>
                </div>
                <Badge tone={a.sev}>Action needed</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold tracking-tight">Recent reports</h3>
          <div className="mt-4 divide-y divide-border">
            {[
              { t: "Food parcels delivered", n: "240 households", time: "12 min ago" },
              { t: "Medical camp wrapped", n: "118 patients seen", time: "1 hr ago" },
              { t: "Shelter intake update", n: "+24 admitted", time: "2 hrs ago" },
              { t: "Hotline call summary", n: "47 inbound", time: "Today" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium">{r.t}</div>
                  <div className="text-xs text-muted-foreground">{r.n}</div>
                </div>
                <div className="text-xs text-muted-foreground">{r.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}