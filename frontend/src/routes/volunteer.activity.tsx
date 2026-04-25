import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Badge } from "@/components/portal/PortalLayout";
import { CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/volunteer/activity")({
  head: () => ({ meta: [{ title: "My Activity — Volunteer" }] }),
  component: () => {
    const log = [
      { t: "Meal distribution · Shelter B", date: "Today, 10:24", status: "Completed", hrs: "2h" },
      { t: "Medical supply transport", date: "Yesterday, 18:02", status: "Completed", hrs: "1h 20m" },
      { t: "Tutoring drop-in", date: "May 12, 16:00", status: "Completed", hrs: "1h" },
      { t: "Hygiene kit packing", date: "May 09, 09:30", status: "Cancelled", hrs: "—" },
    ];
    return (
      <>
        <PageHeader title="My Activity" subtitle="Your full mission history and impact log." />
        <Card className="p-0 overflow-hidden">
          <div className="divide-y divide-border">
            {log.map((l, i) => (
              <div key={i} className="flex items-center gap-4 p-5 hover:bg-muted/30 transition">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${l.status === "Completed" ? "bg-[oklch(0.7_0.16_160_/_0.12)] text-[oklch(0.5_0.16_160)]" : "bg-muted text-muted-foreground"}`}>
                  {l.status === "Completed" ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{l.t}</div>
                  <div className="text-xs text-muted-foreground">{l.date}</div>
                </div>
                <div className="text-xs text-muted-foreground">{l.hrs}</div>
                <Badge tone={l.status === "Completed" ? "emerald" : "neutral"}>{l.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </>
    );
  },
});
