import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader, StatCard, Card, Badge } from "@/components/portal/PortalLayout";
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
      const res = await fetch("http://127.0.0.1:8000/volunteer/tasks");
      if (!res.ok) {
        throw new Error(`Task fetch failed with status ${res.status}`);
      }

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
      const res = await fetch(`http://127.0.0.1:8000/volunteer/${action}/${id}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Task update failed with status ${res.status}`);
      }

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
  const activeRate =
    tasks.length === 0 ? 0 : Math.round((acceptedCount / tasks.length) * 100);

  return (
    <>
      <PageHeader
        title="Volunteer Queue"
        subtitle="See what is waiting for acceptance, what is in progress, and where critical field support is needed right now."
      />

      {message && (
        <div className="mb-5 rounded-2xl border border-[oklch(0.7_0.16_160_/_0.35)] bg-[oklch(0.7_0.16_160_/_0.1)] px-4 py-3 text-sm font-medium text-[oklch(0.45_0.16_160)] shadow-soft">
          {message}
        </div>
      )}

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active tasks"
          value={String(tasks.length)}
          delta={loading ? "Syncing" : "Live"}
          icon={Target}
          tone="emerald"
        />
        <StatCard
          label="Awaiting acceptance"
          value={String(assignedCount)}
          delta="Assigned"
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="In progress"
          value={String(acceptedCount)}
          delta={`${activeRate}% active`}
          icon={Activity}
          tone="amber"
        />
        <StatCard
          label="Critical priority"
          value={String(criticalCount)}
          delta="Urgency 9+"
          icon={AlertTriangle}
          tone="rose"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-emerald text-white shadow-glow">
                <HeartHandshake className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold tracking-tight">Assigned tasks</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live work routed by NGO coordinators.
                </p>
              </div>
            </div>
            <Link
              to="/volunteer/opportunities"
              className="inline-flex items-center gap-1 text-xs font-medium text-accent transition hover:gap-1.5"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-border/70 bg-white/60 p-4 shadow-soft">
                  <div className="h-4 w-32 rounded-full bg-muted" />
                  <div className="mt-2 h-3 w-20 rounded-full bg-muted" />
                  <div className="mt-4 h-10 w-full rounded-2xl bg-muted" />
                </div>
              ))
            ) : liveTasks.length === 0 ? (
              <EmptyState
                title="No assigned volunteer tasks yet"
                copy="As soon as an NGO assigns new work, it will appear here automatically."
              />
            ) : (
              liveTasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex flex-col gap-3 rounded-[1.6rem] border border-border/70 bg-white/65 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">{task.need_type || "Emergency Request"}</span>
                      <Badge tone={urgencyTone(task.urgency)}>{urgencyLabel(task.urgency)}</Badge>
                      <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
                      className="rounded-xl gradient-emerald px-3.5 py-2 text-xs font-medium text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {actionId === task.id && task.status === "Assigned" ? "Accepting..." : "Accept Task"}
                    </button>
                    <button
                      onClick={() => updateTask(task.id, "complete")}
                      disabled={task.status !== "Accepted" || actionId === task.id}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/90 px-3.5 py-2 text-xs font-medium shadow-soft transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
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
          <h3 className="font-semibold tracking-tight">Queue overview</h3>
          <p className="mt-1 text-xs text-muted-foreground">
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
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      metric.tone === "emerald"
                        ? "gradient-emerald"
                        : metric.tone === "blue"
                          ? "gradient-brand"
                          : "gradient-amber"
                    }`}
                    style={{ width: `${metric.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-border/70 bg-white/60 p-4 shadow-soft">
            <div className="text-sm font-semibold tracking-tight">Field note</div>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
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
    <div className="rounded-2xl border border-dashed border-border/80 bg-background/60 px-4 py-6 text-center">
      <div className="text-sm font-semibold tracking-tight">{title}</div>
      <p className="mt-2 text-xs leading-6 text-muted-foreground">{copy}</p>
    </div>
  );
}
