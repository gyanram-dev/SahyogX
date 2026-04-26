import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  PageHeader,
  StatCard,
  Card,
  Badge,
} from "../components/portal/PortalLayout";
import {
  AlertTriangle,
  Users,
  Activity,
  Sparkles,
  MapPin,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/ngo/")({
  head: () => ({ meta: [{ title: "Dashboard — NGO Command Center" }] }),
  component: NgoDashboard,
});

function NgoDashboard() {
  const [requests, setRequests] = useState<any[]>([]);

  const loadRequests = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/requests");
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setRequests([]);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const assignRequest = async (id: number) => {
    try {
      await fetch(`http://127.0.0.1:8000/assign/${id}`, {
        method: "POST",
      });

      await loadRequests();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageHeader
        title="Command Center"
        subtitle="Live coordination across your operating zones."
        action={
          <button className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-medium shadow-soft hover:opacity-90">
            + New Mission
          </button>
        }
      />

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Open Requests"
          value={String(requests.length)}
          delta="Live"
          icon={AlertTriangle}
          tone="rose"
        />

        <StatCard
          label="Active Volunteers"
          value="214"
          delta="+18"
          icon={Users}
          tone="emerald"
        />

        <StatCard
          label="Avg Response"
          value="9m 24s"
          delta="-1m 12s"
          icon={Activity}
          tone="blue"
        />

        <StatCard
          label="Match Accuracy"
          value="93.4%"
          delta="+1.2%"
          icon={TrendingUp}
          tone="amber"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold tracking-tight">
                Live Operations Map
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Realtime requests · volunteers · zones
              </p>
            </div>

            <Badge tone="emerald">● Live</Badge>
          </div>

          <div className="relative h-80 mx-6 mb-6 rounded-xl overflow-hidden border border-border bg-[oklch(0.97_0.01_250)]">
            <div className="absolute inset-0 grid-bg opacity-60" />

            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.62_0.18_255_/_0.08)] to-transparent" />

            {[
              { x: "20%", y: "30%", c: "rose" },
              { x: "55%", y: "55%", c: "emerald" },
              { x: "70%", y: "25%", c: "amber" },
              { x: "35%", y: "70%", c: "rose" },
              { x: "80%", y: "65%", c: "blue" },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute"
                style={{ left: p.x, top: p.y }}
              >
                <span className="absolute -inset-3 rounded-full animate-ping bg-blue-300/40" />

                <span
                  className={`relative block h-3 w-3 rounded-full ring-2 ring-white shadow-elevated ${
                    p.c === "rose"
                      ? "bg-rose-500"
                      : p.c === "emerald"
                      ? "bg-emerald-500"
                      : p.c === "amber"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                />
              </div>
            ))}

            <div className="absolute bottom-3 left-3 glass rounded-lg px-3 py-2 text-[11px] flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Critical
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                High
              </span>

              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Resolved
              </span>
            </div>
          </div>
        </Card>

        {/* Live Requests */}
        <Card>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-brand flex items-center justify-center shadow-glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>

            <h3 className="font-semibold tracking-tight">
              Live Requests
            </h3>
          </div>

          <div className="mt-5 space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {requests.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No live requests yet
              </div>
            ) : (
              requests.map((r, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-border hover:bg-muted/40 transition"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">
                        {r.need_type || "Emergency Request"}
                      </div>

                      <div className="text-xs text-muted-foreground mt-1">
                        {r.location || "Unknown location"}
                      </div>

                      {r.status && (
                        <div className="text-xs mt-1 text-emerald-600 font-medium">
                          {r.status}
                        </div>
                      )}
                    </div>

                    <div className="text-right space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Urgency {r.urgency}
                      </div>

                      <button
                        onClick={() => assignRequest(r.id)}
                        className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700"
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Lower Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <h3 className="font-semibold tracking-tight">
            Underserved Alerts
          </h3>

          <div className="mt-4 space-y-3">
            {[
              {
                z: "North Sector — Ward 12",
                g: "No volunteer in 2.4 km",
                sev: "rose",
              },
              {
                z: "Coastal Block — Ward 7",
                g: "Slow response (avg 28m)",
                sev: "amber",
              },
              {
                z: "Industrial Belt — Ward 4",
                g: "Medical skill gap",
                sev: "amber",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-border"
              >
                <MapPin className="h-4 w-4 text-muted-foreground" />

                <div className="flex-1">
                  <div className="text-sm font-medium">{a.z}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.g}
                  </div>
                </div>

                <Badge tone={a.sev as any}>Alert</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold tracking-tight">
            Recent Reports
          </h3>

          <div className="mt-4 divide-y divide-border">
            {requests.length === 0 ? (
              <div className="py-3 text-sm text-muted-foreground">
                No reports yet
              </div>
            ) : (
              requests.slice(0, 5).map((r, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <div className="text-sm font-medium">
                      {r.need_type}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {r.location}
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Urgency {r.urgency}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}