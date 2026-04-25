import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard, Card, Badge } from "@/components/portal/PortalLayout";
import { Clock, Target, Award, Users, MapPin, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/volunteer/")({
  head: () => ({ meta: [{ title: "Volunteer Home — SahyogX AI" }] }),
  component: VolunteerHome,
});

const tasks = [
  { id: 1, title: "Distribute meals at Shelter B", org: "Hope Foundation", dist: "0.8 km", urgency: "High", match: 96, time: "Now · 2 hrs" },
  { id: 2, title: "Medical supply transport", org: "CareReach", dist: "2.1 km", urgency: "Critical", match: 91, time: "In 30 min" },
  { id: 3, title: "Tutoring for displaced kids", org: "BrightPath NGO", dist: "3.4 km", urgency: "Medium", match: 88, time: "Today 4pm" },
];

function VolunteerHome() {
  return (
    <>
      <PageHeader
        title="Welcome back, Aarav 👋"
        subtitle="3 nearby tasks match your skills right now. You're 2 missions away from the Bronze badge."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Hours contributed" value="42" delta="+6 this wk" icon={Clock} tone="blue" />
        <StatCard label="Match accuracy" value="94%" delta="+2%" icon={Target} tone="emerald" />
        <StatCard label="Reliability score" value="A+" icon={Award} tone="amber" />
        <StatCard label="People helped" value="128" delta="+12" icon={Users} tone="rose" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold tracking-tight">Nearby tasks</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Ranked by AI match score</p>
            </div>
            <Link to="/volunteer/opportunities" className="text-xs font-medium text-accent flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {tasks.map((t) => (
              <div key={t.id} className="group flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-border hover:border-accent/40 hover:bg-muted/40 transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">{t.title}</span>
                    <Badge tone={t.urgency === "Critical" ? "rose" : t.urgency === "High" ? "amber" : "blue"}>
                      {t.urgency}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                    <span>{t.org}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {t.dist}</span>
                    <span>{t.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Match</div>
                    <div className="font-semibold text-[oklch(0.5_0.16_160)]">{t.match}%</div>
                  </div>
                  <button className="text-xs font-medium px-3 py-2 rounded-lg gradient-emerald text-white shadow-soft hover:shadow-elevated transition">
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold tracking-tight">Your impact</h3>
          <p className="text-xs text-muted-foreground mt-0.5">This month</p>
          <div className="mt-6 space-y-5">
            {[
              { label: "Missions completed", v: "11 / 15" , p: 73, tone: "emerald" },
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
