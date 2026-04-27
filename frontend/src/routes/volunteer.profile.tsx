import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Badge } from "@/components/portal/PortalLayout";

export const Route = createFileRoute("/volunteer/profile")({
  head: () => ({ meta: [{ title: "Profile - Volunteer" }] }),
  component: () => (
    <>
      <PageHeader title="Profile" subtitle="Manage verified skills, availability, and response readiness." />
      <div className="grid lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl gradient-emerald shadow-glow" />
            <div>
              <div className="font-semibold tracking-tight">Aarav Sharma</div>
              <div className="text-xs text-muted-foreground">Joined March 2024</div>
              <div className="mt-2 flex gap-1.5">
                <Badge tone="emerald">Verified</Badge>
                <Badge tone="amber">Top 5%</Badge>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 text-center">
            <div><div className="text-lg font-semibold">42</div><div className="text-xs text-muted-foreground">Hours</div></div>
            <div><div className="text-lg font-semibold">11</div><div className="text-xs text-muted-foreground">Missions</div></div>
            <div><div className="text-lg font-semibold">A+</div><div className="text-xs text-muted-foreground">Score</div></div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-semibold tracking-tight">Skills & availability</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {["First aid", "Driving", "Hindi", "Tamil", "Logistics", "Coordination", "Lifting"].map((s) => (
              <Badge key={s} tone="blue">{s}</Badge>
            ))}
          </div>
          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border">
              <div className="text-xs text-muted-foreground">Weekday window</div>
              <div className="font-medium mt-1">6 PM - 10 PM</div>
            </div>
            <div className="p-4 rounded-xl border border-border">
              <div className="text-xs text-muted-foreground">Weekend window</div>
              <div className="font-medium mt-1">All day</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  ),
});
