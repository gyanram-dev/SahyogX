import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader, StatCard, Card, Badge } from "@/components/portal/PortalLayout";
import { Clock, Target, Award, Users, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/volunteer/")({
  head: () => ({ meta: [{ title: "Volunteer Home - SahyogX AI" }] }),
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
      const res = await fetch(`http://127.0.0.1:8000/volunteer/${action}/${id}`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Task update failed with status ${res.status}`);
      }

      await loadTasks();
    } catch (error) {
      console.log(error);
    } finally {
      setActionId(null);
    }
  };

  const acceptedCount = tasks.filter((task) => task.status === "Accepted").length;

  return (
    <>
      <PageHeader
        title="Welcome back, Aarav"
        subtitle={`${tasks.length} assigned tasks are ready in your queue. You're 2 missions away from the Bronze badge.`}
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Hours contributed" value="42" delta="+6 this wk" icon={Clock} tone="blue" />
        <StatCard label="Active tasks" value={String(tasks.length)} delta={loading ? "Syncing" : "Live"} icon={Target} tone="emerald" />
        <StatCard label="Reliability score" value="A+" icon={Award} tone="amber" />
        <StatCard label="Accepted now" value={String(acceptedCount)} delta="+12 helped" icon={Users} tone="rose" />
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
                      Accept Task
                    </button>
                    <button
                      onClick={() => updateTask(task.id, "complete")}
                      disabled={task.status !== "Accepted" || actionId === task.id}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold tracking-tight">Your impact</h3>
          <p className="text-xs text-muted-foreground mt-0.5">This month</p>
          <div className="mt-6 space-y-5">
            {[
              { label: "Missions completed", v: "11 / 15", p: 73, tone: "emerald" },
              { label: "Avg. response time", v: "12 min", p: 88, tone: "blue" },
              { label: "Skill coverage", v: "5 / 7", p: 71, tone: "amber" },
            ].map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{r.label}</span>
                  <span className="font-medium">{r.v}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${r.tone === "emerald" ? "gradient-emerald" : r.tone === "blue" ? "gradient-brand" : "gradient-amber"}`}
                    style={{ width: `${r.p}%` }}
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
