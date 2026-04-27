import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

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
  assigned_to?: string | null;
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

const statusLabel = (status?: RequestStatus) => status || "Raised";

export const Route = createFileRoute("/ngo/")({
  head: () => ({ meta: [{ title: "Dashboard - NGO Command Center" }] }),
  component: NgoDashboard,
});

function NgoDashboard() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadRequests = async () => {
    try {
      const res = await fetch(apiUrl("/requests"));
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setRequests([]);
    } finally {
      setLoading(false);
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

      const res = await fetch(apiUrl(`/${action}/${id}`), {
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

  const sortedRequests = useMemo(
    () =>
      [...requests].sort((a, b) => {
        const urgencyDiff = (b.urgency || 0) - (a.urgency || 0);
        if (urgencyDiff !== 0) return urgencyDiff;
        return (a.id || 0) - (b.id || 0);
      }),
    [requests],
  );

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

  const priorityQueue = sortedRequests.filter((r) =>
    ["Raised", "Under Review", "Assigned", "Accepted"].includes(r.status || ""),
  ).slice(0, 4);

  const recentReports = [...sortedRequests]
    .sort((a, b) => (b.id || 0) - (a.id || 0))
    .slice(0, 5);

  return (
    <>
      <PageHeader
        title="Command Center"
        subtitle="Monitor incoming needs, move cases through review, and keep volunteer execution visible in one live workspace."
        action={
          <Link
            to="/ngo/post"
            className="inline-flex items-center gap-2 rounded-2xl gradient-brand px-4 py-2.5 text-sm font-medium text-white shadow-elevated transition hover:-translate-y-0.5 hover:opacity-95"
          >
            <ClipboardList className="h-4 w-4" />
            Post Task
          </Link>
        }
      />

      {message && (
        <div className="mb-5 rounded-2xl border border-[oklch(0.7_0.16_160_/_0.35)] bg-[oklch(0.7_0.16_160_/_0.1)] px-4 py-3 text-sm font-medium text-[oklch(0.45_0.16_160)] shadow-soft">
          {message}
        </div>
      )}

      <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
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
          delta="Field active"
          icon={Activity}
          tone="emerald"
        />
        <StatCard
          label="Completed Requests"
          value={String(completedRequests)}
          delta={`${completionRate}% closed`}
          icon={TrendingUp}
          tone="rose"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6">
            <div>
              <h3 className="font-semibold tracking-tight">Live Operations View</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Visual pulse of active requests, volunteer movement, and critical zones.
              </p>
            </div>
            <Badge tone="emerald">Live</Badge>
          </div>

          <div className="relative mx-6 mb-6 mt-5 h-80 overflow-hidden rounded-[1.6rem] border border-border/70 bg-[oklch(0.97_0.01_250)]">
            <div className="absolute inset-0 grid-bg opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.62_0.18_255_/_0.08)] via-transparent to-[oklch(0.72_0.17_162_/_0.1)]" />

            {[
              { x: "20%", y: "30%", c: "rose" },
              { x: "55%", y: "55%", c: "emerald" },
              { x: "70%", y: "25%", c: "amber" },
              { x: "35%", y: "70%", c: "rose" },
              { x: "80%", y: "65%", c: "blue" },
            ].map((p, i) => (
              <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
                <span className="absolute -inset-3 rounded-full animate-ping bg-blue-300/40" />
                <span
                  className={`relative block h-3.5 w-3.5 rounded-full ring-4 ring-white/75 shadow-elevated ${
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

            <div className="absolute bottom-4 left-4 rounded-2xl glass px-3.5 py-2 text-[11px] shadow-soft">
              <div className="flex items-center gap-4 text-muted-foreground">
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
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl gradient-brand text-white shadow-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold tracking-tight">Live Requests</h3>
              <p className="text-xs text-muted-foreground">Prioritized by urgency</p>
            </div>
          </div>

          <div className="scrollbar-soft mt-5 max-h-[362px] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-border/70 bg-white/60 p-4 shadow-soft">
                  <div className="h-4 w-28 rounded-full bg-muted" />
                  <div className="mt-3 h-3 w-20 rounded-full bg-muted" />
                  <div className="mt-4 h-8 w-full rounded-xl bg-muted" />
                </div>
              ))
            ) : sortedRequests.length === 0 ? (
              <EmptyState
                title="No live requests yet"
                copy="Incoming requests will appear here automatically as citizens submit them."
              />
            ) : (
              sortedRequests.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-border/70 bg-white/65 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{r.need_type || "Emergency Request"}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {r.location || "Unknown location"}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge tone={statusTone(r.status)}>{statusLabel(r.status)}</Badge>
                        <span className="text-[11px] font-medium text-muted-foreground">
                          Urgency {r.urgency}
                        </span>
                      </div>
                      {r.assigned_to && (
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          Assigned to {r.assigned_to}
                        </div>
                      )}
                    </div>

                    <div className="min-w-[130px] text-right">
                      <div className="flex flex-col gap-1.5">
                        {r.status === "Raised" && (
                          <button
                            onClick={() =>
                              updateRequest(r.id, "review", "Request moved to Under Review.")
                            }
                            disabled={actionId === `review-${r.id}`}
                            className="rounded-xl border border-border bg-background/90 px-3 py-2 text-xs font-medium transition hover:bg-white disabled:opacity-50"
                          >
                            {actionId === `review-${r.id}` ? "Reviewing..." : "Review"}
                          </button>
                        )}

                        {(r.status === "Raised" || r.status === "Under Review") && (
                          <button
                            onClick={() => updateRequest(r.id, "assign", "Request assigned.")}
                            disabled={actionId === `assign-${r.id}`}
                            className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:opacity-50"
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
                            className="rounded-xl bg-foreground px-3 py-2 text-xs font-medium text-background shadow-soft transition hover:-translate-y-0.5 hover:opacity-90 disabled:opacity-50"
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold tracking-tight">Priority Queue</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Highest-urgency requests still in active handling.
              </p>
            </div>
            <Badge tone="amber">{priorityQueue.length} active</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-border/70 bg-white/60 p-4 shadow-soft">
                  <div className="h-4 w-32 rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-24 rounded-full bg-muted" />
                </div>
              ))
            ) : priorityQueue.length === 0 ? (
              <EmptyState
                title="No active priority requests"
                copy="When new requests need review, assignment, or closure, they will show up here."
              />
            ) : (
              priorityQueue.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white/65 p-4 shadow-soft"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[oklch(0.68_0.2_20_/_0.12)] text-[oklch(0.55_0.22_20)]">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{request.need_type}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {request.location} · Urgency {request.urgency}
                    </div>
                  </div>
                  <Badge tone={statusTone(request.status)}>{statusLabel(request.status)}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold tracking-tight">Recent Reports</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest request records and their current workflow stage.
              </p>
            </div>
            <Link
              to="/ngo/post"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent transition hover:gap-1.5"
            >
              Add task <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-border/70">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse py-4">
                  <div className="h-4 w-40 rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-24 rounded-full bg-muted" />
                </div>
              ))
            ) : recentReports.length === 0 ? (
              <div className="py-4">
                <EmptyState
                  title="No reports yet"
                  copy="Citizen-submitted requests will appear here with their live workflow status."
                />
              </div>
            ) : (
              recentReports.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">{r.need_type}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {r.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge tone={statusTone(r.status)}>{statusLabel(r.status)}</Badge>
                    <div className="mt-1 text-xs text-muted-foreground">Urgency {r.urgency}</div>
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

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 bg-background/60 px-4 py-6 text-center">
      <div className="text-sm font-semibold tracking-tight">{title}</div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}
