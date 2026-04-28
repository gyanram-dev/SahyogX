import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, StatCard, Card, Badge } from "@/components/portal/PortalLayout";
import { apiUrl } from "@/lib/api";
import {
  Target,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Activity,
  HeartHandshake,
} from "lucide-react";

export const Route = createFileRoute("/volunteer/")({
  head: () => ({ meta: [{ title: "Volunteer Home - SahyogX" }] }),
  component: VolunteerHome,
});

type VolunteerTask = {
  id: number;
  need_type: string;
  location: string;
  urgency: number;
  status: "Assigned" | "Accepted" | "Completed" | string;
  assigned_to?: string | null;
};

type BadgeTone = "blue" | "emerald" | "amber" | "rose" | "neutral";

const urgencyLabel = (urgency: number) => {
  if (urgency >= 9) return "Critical";
  if (urgency >= 7) return "High";
  if (urgency >= 5) return "Medium";
  return "Low";
};

const urgencyTone = (urgency: number): BadgeTone => {
  if (urgency >= 9) return "rose";
  if (urgency >= 7) return "amber";
  if (urgency >= 5) return "blue";
  return "neutral";
};

const statusTone = (status: string): BadgeTone => {
  if (status === "Accepted") return "emerald";
  if (status === "Completed") return "blue";
  return "amber";
};

function VolunteerHome() {
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  const loadTasks = async () => {
    try {
      const res = await fetch(apiUrl("/volunteer/tasks"));
      if (!res.ok) throw new Error(`Task fetch failed with status ${res.status}`);
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const interval = window.setInterval(loadTasks, 3000);
    return () => window.clearInterval(interval);
  }, []);

  const updateTask = async (id: number, action: "accept" | "complete") => {
    try {
      setActionId(id);
      setMessage("");
      const res = await fetch(apiUrl(`/volunteer/${action}/${id}`), {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Task update failed with status ${res.status}`);
      await loadTasks();
      setMessage(action === "accept" ? "Task accepted." : "Task marked complete.");
    } catch (error) {
      console.log(error);
      setMessage("Action failed. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const liveTasks = useMemo(
    () => [...tasks].sort((a, b) => (b.urgency || 0) - (a.urgency || 0)),
    [tasks],
  );

  const acceptedCount = tasks.filter((task) => task.status === "Accepted").length;
  const assignedCount = tasks.filter((task) => task.status === "Assigned").length;
  const criticalCount = tasks.filter((task) => task.urgency >= 9).length;
  const activeRate = tasks.length === 0 ? 0 : Math.round((acceptedCount / tasks.length) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <>
      <PageHeader
        title="Volunteer Queue"
        subtitle="See what is waiting for acceptance, what is in progress, and where critical field support is needed right now."
      />

      {message && (
        <div className="mb-5 rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-400">
          {message}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active tasks", value: tasks.length, icon: Target, delta: loading ? "Syncing" : "Live", tone: "emerald" as const },
          { label: "Awaiting acceptance", value: assignedCount, icon: Users, delta: "Assigned", tone: "blue" as const },
          { label: "In progress", value: acceptedCount, icon: Activity, delta: `${activeRate}% active`, tone: "amber" as const },
          { label: "Critical priority", value: criticalCount, icon: AlertTriangle, delta: "Urgency 9+", tone: "rose" as const },
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
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-teal-glow">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-bold text-white">Assigned tasks</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Live work routed by NGO coordinators.
                </p>
              </div>
            </div>
            <Link
              to="/volunteer/opportunities"
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-400 hover:gap-1.5 transition-all"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl border border-teal-500/10 bg-slate-900/50 p-4">
                  <div className="h-4 w-32 rounded bg-slate-800" />
                  <div className="mt-2 h-3 w-20 rounded bg-slate-800" />
                  <div className="mt-4 h-10 w-full rounded bg-slate-800" />
                </div>
              ))
            ) : liveTasks.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/30 px-4 py-6 text-center">
                <div className="text-sm font-medium text-slate-400">No assigned volunteer tasks yet</div>
                <p className="mt-2 text-xs text-slate-500">As soon as an NGO assigns new work, it will appear here automatically.</p>
              </div>
            ) : (
              liveTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex flex-col gap-3 rounded-xl border border-teal-500/10 bg-slate-900/30 p-4 transition-all hover:border-teal-500/25 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-white">{task.need_type || "Emergency Request"}</span>
                      <Badge tone={urgencyTone(task.urgency)}>{urgencyLabel(task.urgency)}</Badge>
                      <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span>{task.assigned_to || "Volunteer assignment"}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {task.location || "Unknown location"}
                      </span>
                      <span>Urgency {task.urgency}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => updateTask(task.id, "accept")}
                      disabled={task.status !== "Assigned" || actionId === task.id}
                      className="rounded-xl bg-teal-500 text-black font-semibold px-3.5 py-2 text-xs transition hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionId === task.id && task.status === "Assigned" ? "Accepting..." : "Accept Task"}
                    </button>
                    <button
                      onClick={() => updateTask(task.id, "complete")}
                      disabled={task.status !== "Accepted" || actionId === task.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/20 bg-teal-500/10 px-3.5 py-2 text-xs font-medium text-teal-400 hover:bg-teal-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {actionId === task.id && task.status === "Accepted" ? "Completing..." : "Mark Complete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-white">Queue overview</h3>
          <p className="mt-1 text-xs text-slate-500">
            Derived from live volunteer task status.
          </p>

          <div className="mt-6 space-y-5">
            {[
              {
                label: "Awaiting acceptance",
                value: `${assignedCount} task${assignedCount === 1 ? "" : "s"}`,
                width: tasks.length === 0 ? 0 : Math.round((assignedCount / tasks.length) * 100),
                tone: "blue",
              },
              {
                label: "Accepted and in progress",
                value: `${acceptedCount} task${acceptedCount === 1 ? "" : "s"}`,
                width: tasks.length === 0 ? 0 : Math.round((acceptedCount / tasks.length) * 100),
                tone: "emerald",
              },
              {
                label: "Critical urgency",
                value: `${criticalCount} task${criticalCount === 1 ? "" : "s"}`,
                width: tasks.length === 0 ? 0 : Math.round((criticalCount / tasks.length) * 100),
                tone: "amber",
              },
            ].map((metric) => (
              <div key={metric.label}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{metric.label}</span>
                  <span className="font-semibold text-teal-400">{metric.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metric.tone === "emerald" ? "bg-teal-500" : metric.tone === "blue" ? "bg-blue-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${metric.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-teal-500/10 bg-slate-900/50 px-4 py-4">
            <div className="text-sm font-semibold text-white">Field note</div>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              Accept tasks as soon as you are ready to take ownership so coordinators can see which missions are actively moving.
            </p>
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