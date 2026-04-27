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

type RequestStatus =
  | "Raised"
  | "Under Review"
  | "Assigned"
  | "Accepted"
  | "Completed"
  | "Closed"
  | string;

type HelpRequest = {
  id: number;
  need_type?: string;
  location?: string;
  urgency?: number;
  status?: RequestStatus;
};

type BadgeTone = "blue" | "emerald" | "amber" | "rose" | "neutral";

const statusTone = (status?: RequestStatus): BadgeTone => {
  if (status === "Raised") return "rose";
  if (status === "Under Review") return "amber";
  if (status === "Assigned") return "blue";
  if (status === "Accepted") return "emerald";
  if (status === "Completed") return "emerald";
  if (status === "Closed") return "neutral";
  return "neutral";
};

export const Route = createFileRoute("/ngo/")({
  head: () => ({ meta: [{ title: "Dashboard - NGO Command Center" }] }),
  component: NgoDashboard,
});

function NgoDashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

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

    const interval = window.setInterval(loadRequests, 3000);
    return () => window.clearInterval(interval);
  }, []);

  const updateRequest = async (
    id: number,
    action: "review" | "assign" | "close",
    successMessage: string,
  ) => {
    try {
      setActionId(`${action}-${id}`);
      setMessage("");

      const res = await fetch(`http://127.0.0.1:8000/${action}/${id}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Request update failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data?.request) {
        setRequests((current) =>
          current.map((request) =>
            request.id === id ? { ...request, ...data.request } : request,
          ),
        );
      }

      setMessage(successMessage);
      await loadRequests();
    } catch (error) {
      console.log(error);
      setMessage("Action failed. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) =>
    ["Raised", "Under Review"].includes(r.status || ""),
  ).length;
  const assignedRequests = requests.filter((r) =>
    ["Assigned", "Accepted"].includes(r.status || ""),
  ).length;
  const completedRequests = requests.filter((r) =>
    ["Completed", "Closed"].includes(r.status || ""),
  ).length;
  const completionRate =
    totalRequests === 0 ? 0 : Math.round((completedRequests / totalRequests) * 100);

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

      {message && (
        <div className="mb-4 rounded-xl border border-[oklch(0.7_0.16_160_/_0.35)] bg-[oklch(0.7_0.16_160_/_0.1)] px-4 py-3 text-sm font-medium text-[oklch(0.45_0.16_160)]">
          {message}
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Requests"
          value={String(totalRequests)}
          delta="Live"
          icon={AlertTriangle}
          tone="blue"
        />

        <StatCard
          label="Pending Requests"
          value={String(pendingRequests)}
          delta="Raised + review"
          icon={Users}
          tone="amber"
        />

        <StatCard
          label="Assigned Requests"
          value={String(assignedRequests)}
          delta="Active"
          icon={Activity}
          tone="emerald"
        />

        <StatCard
          label="Completed Requests"
          value={String(completedRequests)}
          delta={`${completionRate}% rate`}
          icon={TrendingUp}
          tone="rose"
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
                Live requests, volunteers, and zones
              </p>
            </div>

            <Badge tone="emerald">Live</Badge>
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
              requests.map((r) => (
                <div
                  key={r.id}
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

                      <div className="mt-2">
                        <Badge tone={statusTone(r.status)}>
                          {r.status || "Raised"}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right space-y-2 min-w-[128px]">
                      <div className="text-xs text-muted-foreground">
                        Urgency {r.urgency}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {r.status === "Raised" && (
                          <button
                            onClick={() =>
                              updateRequest(
                                r.id,
                                "review",
                                "Request moved to Under Review.",
                              )
                            }
                            disabled={actionId === `review-${r.id}`}
                            className="px-3 py-1.5 rounded-lg text-xs border border-border bg-card hover:bg-muted disabled:opacity-50"
                          >
                            {actionId === `review-${r.id}` ? "Reviewing..." : "Review"}
                          </button>
                        )}

                        {(r.status === "Raised" || r.status === "Under Review") && (
                          <button
                            onClick={() =>
                              updateRequest(r.id, "assign", "Request assigned.")
                            }
                            disabled={actionId === `assign-${r.id}`}
                            className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            {actionId === `assign-${r.id}` ? "Assigning..." : "Assign"}
                          </button>
                        )}

                        {r.status === "Completed" && (
                          <button
                            onClick={() =>
                              updateRequest(r.id, "close", "Completed request closed.")
                            }
                            disabled={actionId === `close-${r.id}`}
                            className="px-3 py-1.5 rounded-lg text-xs bg-foreground text-background hover:opacity-90 disabled:opacity-50"
                          >
                            {actionId === `close-${r.id}` ? "Closing..." : "Close"}
                          </button>
                        )}
                      </div>
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

                  <div className="text-right space-y-1">
                    <Badge tone={statusTone(r.status)}>
                      {r.status || "Raised"}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      Urgency {r.urgency}
                    </div>
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
