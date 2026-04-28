import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  PageHeader,
  StatCard,
  Card,
  Badge,
} from "@/components/portal/PortalLayout";
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
            className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-teal-400 shadow-teal-glow"
          >
            <ClipboardList className="h-4 w-4" />
            Post Task
          </Link>
        }
      />

      {message && (
        <div className="mb-5 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-400">
          {message}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Requests", value: totalRequests, icon: AlertTriangle, delta: "Live", tone: "blue" as const },
          { label: "Pending Requests", value: pendingRequests, icon: Users, delta: "Raised + review", tone: "amber" as const },
          { label: "Assigned Requests", value: assignedRequests, icon: Activity, delta: "Field active", tone: "emerald" as const },
          { label: "Completed Requests", value: completedRequests, icon: TrendingUp, delta: `${completionRate}% closed`, tone: "rose" as const },
        ].map((stat, idx) => (
          <div key={stat.label} className={idx === 0 ? "animate-pulse-glow" : ""}>
            <StatCard
              label={stat.label}
              value={String(stat.value)}
              delta={stat.delta}
              icon={stat.icon}
              tone={stat.tone}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6">
            <div>
              <h3 className="font-bold text-white">Live Operations View</h3>
              <p className="mt-1 text-xs text-slate-500">
                Visual pulse of active requests, volunteer movement, and critical zones.
              </p>
            </div>
            <Badge tone="emerald">Live</Badge>
          </div>

          <div className="relative mx-6 mb-6 mt-5 h-80 overflow-hidden rounded-2xl border border-teal-500/10 bg-slate-900/50">
            <div className="absolute inset-0 grid-bg opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-blue-500/5" />

            {[
              { x: "20%", y: "30%", c: "rose" },
              { x: "55%", y: "55%", c: "emerald" },
              { x: "70%", y: "25%", c: "amber" },
              { x: "35%", y: "70%", c: "rose" },
              { x: "80%", y: "65%", c: "blue" },
            ].map((p, i) => (
              <div key={i} className="absolute" style={{ left: p.x, top: p.y }}>
                <span className="absolute -inset-3 rounded-full animate-ping bg-teal-400/30" />
                <span
                  className={`relative block h-3.5 w-3.5 rounded-full ring-2 ring-slate-900 shadow-teal-glow ${
                    p.c === "rose"
                      ? "bg-rose-500"
                      : p.c === "emerald"
                        ? "bg-teal-500"
                        : p.c === "amber"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                  }`}
                />
              </div>
            ))}

            <div className="absolute bottom-4 left-4 rounded-xl border border-teal-500/10 bg-slate-900/80 px-3.5 py-2 text-[10px]">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Critical
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  High
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-teal-500" />
                  Resolved
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-teal-glow">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-white">Live Requests</h3>
              <p className="text-xs text-slate-500">Prioritized by urgency</p>
            </div>
          </div>

          <div className="scrollbar-soft mt-5 max-h-[362px] space-y-3 overflow-y-auto pr-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-teal-500/10 bg-slate-900/50 p-4">
                  <div className="h-4 w-28 rounded bg-slate-800" />
                  <div className="mt-3 h-3 w-20 rounded bg-slate-800" />
                  <div className="mt-4 h-8 w-full rounded bg-slate-800" />
                </div>
              ))
            ) : sortedRequests.length === 0 ? (
              <EmptyState
                title="No live requests yet"
                copy="Incoming requests will appear here automatically."
              />
            ) : (
              sortedRequests.map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-teal-500/10 bg-slate-900/30 p-4 transition-all hover:border-teal-500/25"
                >
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white">{r.need_type || "Emergency Request"}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {r.location || "Unknown location"}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge tone={statusTone(r.status)}>{statusLabel(r.status)}</Badge>
                        <span className="text-[10px] font-semibold text-slate-500">
                          Urgency {r.urgency}
                        </span>
                      </div>
                      {r.assigned_to && (
                        <div className="mt-2 text-[10px] text-slate-500">
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
                            className="rounded-xl border border-teal-500/20 bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                          >
                            {actionId === `review-${r.id}` ? "Reviewing..." : "Review"}
                          </button>
                        )}

                        {(r.status === "Raised" || r.status === "Under Review") && (
                          <button
                            onClick={() => updateRequest(r.id, "assign", "Request assigned.")}
                            disabled={actionId === `assign-${r.id}`}
                            className="rounded-xl bg-teal-500 px-3 py-2 text-xs font-semibold text-black transition hover:bg-teal-400 disabled:opacity-50"
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
                            className="rounded-xl bg-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-slate-600 disabled:opacity-50"
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
              <h3 className="font-bold text-white">Priority Queue</h3>
              <p className="mt-1 text-xs text-slate-500">
                Highest-urgency requests still in active handling.
              </p>
            </div>
            <Badge tone="amber">{priorityQueue.length} active</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-teal-500/10 bg-slate-900/50 p-4">
                  <div className="h-4 w-32 rounded bg-slate-800" />
                  <div className="mt-2 h-3 w-24 rounded bg-slate-800" />
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
                  className="flex items-center gap-3 rounded-xl border border-teal-500/10 bg-slate-900/30 p-4 transition-all hover:border-teal-500/25"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white">{request.need_type}</div>
                    <div className="mt-1 text-xs text-slate-500">
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
              <h3 className="font-bold text-white">Recent Reports</h3>
              <p className="mt-1 text-xs text-slate-500">
                Latest request records and their current workflow stage.
              </p>
            </div>
            <Link
              to="/ngo/post"
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:gap-1.5 transition-all"
            >
              Add task <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-1">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between gap-4 py-3">
                  <div className="h-4 w-40 rounded bg-slate-800" />
                  <div className="h-3 w-24 rounded bg-slate-800" />
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
              recentReports.map((r, idx) => (
                <div key={r.id} className={`flex items-center justify-between gap-4 py-3 ${idx < recentReports.length - 1 ? "border-b border-teal-500/10" : ""}`}>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-white">{r.need_type}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      {r.location}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge tone={statusTone(r.status)}>{statusLabel(r.status)}</Badge>
                    <div className="mt-1 text-xs text-slate-500">Urgency {r.urgency}</div>
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
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-4 py-6 text-center">
      <div className="text-sm font-medium text-slate-400">{title}</div>
      <p className="mt-2 text-xs leading-6 text-slate-500">{copy}</p>
    </div>
  );
}