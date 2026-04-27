import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Badge } from "@/components/portal/PortalLayout";
import { MapPin, Filter } from "lucide-react";

export const Route = createFileRoute("/volunteer/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities - Volunteer" }] }),
  component: Opportunities,
});

const items = [
  { t: "Flood relief - sandbag support", org: "RiverGuard", urg: "Critical", match: 98, dist: "1.2 km", skills: ["Lifting", "Outdoor"] },
  { t: "Blood donation drive coordinator", org: "RedCare", urg: "High", match: 92, dist: "2.7 km", skills: ["Coordination"] },
  { t: "Translate hotline calls (Hindi/Tamil)", org: "VoiceLine", urg: "High", match: 90, dist: "Remote", skills: ["Languages"] },
  { t: "Pack hygiene kits", org: "CleanStart", urg: "Medium", match: 85, dist: "0.5 km", skills: ["Logistics"] },
  { t: "Drive elderly to vaccination", org: "ElderCare+", urg: "Medium", match: 81, dist: "4.1 km", skills: ["Driving"] },
  { t: "Storytelling at child shelter", org: "BrightPath", urg: "Low", match: 76, dist: "3.0 km", skills: ["Communication"] },
];

function Opportunities() {
  return (
    <>
      <PageHeader
        title="Opportunities"
        subtitle="Available missions from verified NGOs, ranked by fit and urgency."
        action={
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:bg-muted">
            <Filter className="h-4 w-4" /> Filter
          </button>
        }
      />
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((i, idx) => (
          <Card key={idx} className="hover:shadow-elevated transition">
            <div className="flex items-start justify-between gap-2">
              <Badge tone={i.urg === "Critical" ? "rose" : i.urg === "High" ? "amber" : i.urg === "Medium" ? "blue" : "neutral"}>{i.urg}</Badge>
              <div className="text-xs font-semibold text-[oklch(0.5_0.16_160)]">{i.match}% match</div>
            </div>
            <div className="mt-4 font-medium tracking-tight">{i.t}</div>
            <div className="text-xs text-muted-foreground mt-1">{i.org}</div>
            <div className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {i.dist}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {i.skills.map((s) => <Badge key={s} tone="neutral">{s}</Badge>)}
            </div>
            <button className="mt-5 w-full text-sm font-medium py-2 rounded-lg gradient-emerald text-white shadow-soft">
              View mission
            </button>
          </Card>
        ))}
      </div>
    </>
  );
}
