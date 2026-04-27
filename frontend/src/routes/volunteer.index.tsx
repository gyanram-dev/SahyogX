import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, StatCard, Card, Badge } from "@/components/portal/PortalLayout";
import { Target, Users, MapPin, ArrowRight, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

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

  const acceptedCount = tasks.filter((task) => task.status === "Accepted").length;
  const assignedCount = tasks.filter((task) => task.status === "Assigned").length;
  const criticalCount = tasks.filter((task) => task.urgency >= 9).length;
  const activeRate =
    tasks.length === 0 ? 0 : Math.round((acceptedCount / tasks.length) * 100);

  return (
    <>
      <PageHeader
        title="Welcome back, Aarav"
        subtitle={`${tasks.length} live tasks are in the volunteer queue right now.`}
      />
      {message && (
        <div className="mb-4 rounded-xl border border-[oklch(0.7_0.16_160_/_0.35)] bg-[oklch(0.7_0.16_160_/_0.1)] px-4 py-3 text-sm font-medium text-[oklch(0.45_0.16_160)]">
          {message}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active tasks" value={String(tasks.length)} delta={loading ? "Syncing" : "Live"} icon={Target} tone="emerald" />
        <StatCard label="Awaiting acceptance" value={String(assignedCount)} delta="Assigned" icon={Users} tone="blue" />
        <StatCard label="In progress" value={String(acceptedCount)} delta={`${activeRate}% active`} icon={Activity} tone="amber" />
        <StatCard label="Critical priority" value={String(criticalCount)} delta="Urgency 9+" icon={AlertTriangle} tone="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold tracking-tight">Assigned tasks</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Live work sent by NGO coordinators</p>
            </div>
            <Link to="/volunteer/opportunities" className="text-xs font-medium text-accent flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              <div className="p-4 rounded-xl border border-border text-sm text-muted-foreground">
                Loading assigned tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-4 rounded-xl border border-border text-sm text-muted-foreground">
                No assigned volunteer tasks yet.
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="group flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border hover:border-accent/40 hover:bg-muted/40 transition">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm">{task.need_type || "Emergency Request"}</span>
                      <Badge tone={urgencyTone(task.urgency)}>
                        {urgencyLabel(task.urgency)}
                      </Badge>
                      <Badge tone={statusTone(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3 flex-wrap">
                      <span>{task.assigned_to || "Volunteer assignment"}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {task.location || "Unknown location"}</span>
                      <span>Urgency {task.urgency}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => updateTask(task.id, "accept")}
                      disabled={task.status !== "Assigned" || actionId === task.id}
                      className="text-xs font-medium px-3 py-2 rounded-lg gradient-emerald text-white shadow-soft hover:shadow-elevated transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionId === task.id && task.status === "Assigned"
                        ? "Accepting..."
                        : "Accept Task"}
                    </button>
                    <button
                      onClick={() => updateTask(task.id, "complete")}
                      disabled={task.status !== "Accepted" || actionId === task.id}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {actionId === task.id && task.status === "Accepted"
                        ? "Completing..."
                        : "Mark Complete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold tracking-tight">Queue overview</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Derived from live volunteer tasks</p>
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
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${metric.tone === "emerald" ? "gradient-emerald" : metric.tone === "blue" ? "gradient-brand" : "gradient-amber"}`}
                    style={{ width: `${metric.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
