import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card, Badge } from "@/components/portal/PortalLayout";
import { Award, Clock3, HeartHandshake, ShieldCheck, Users } from "lucide-react";

const impactStats = [
  {
    label: "Tasks Completed",
    value: "28",
    note: "Lifetime snapshot",
    icon: ShieldCheck,
    tone: "emerald" as const,
  },
  {
    label: "Hours Contributed",
    value: "64h",
    note: "Field + coordination",
    icon: Clock3,
    tone: "blue" as const,
  },
  {
    label: "People Helped",
    value: "143",
    note: "Estimated reach",
    icon: Users,
    tone: "amber" as const,
  },
  {
    label: "Reliability Score",
    value: "96%",
    note: "Response consistency",
    icon: Award,
    tone: "rose" as const,
  },
];

export const Route = createFileRoute("/volunteer/profile")({
  head: () => ({ meta: [{ title: "Profile - Volunteer" }] }),
  component: VolunteerProfile,
});

function VolunteerProfile() {
  return (
    <>
      <PageHeader
        title="Profile"
        subtitle="Manage verified skills, availability, and a polished volunteer impact snapshot."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl gradient-emerald shadow-glow" />
            <div>
              <div className="font-semibold tracking-tight">Verified volunteer profile</div>
              <div className="text-xs text-muted-foreground">
                Operational readiness snapshot
              </div>
              <div className="mt-2 flex gap-1.5">
                <Badge tone="emerald">Verified</Badge>
                <Badge tone="blue">Active</Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border/70 bg-white/4 border border-white/8 p-4 shadow-soft">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Impact Summary
            </div>
            <div className="mt-2 text-sm leading-6 text-muted-foreground">
              Profile-level lifetime impact metrics are presented here as a polished volunteer showcase until personal tracking is connected.
            </div>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-border/70 bg-white/4 border border-white/8 px-3 py-4 shadow-soft">
              <div className="text-lg font-semibold">7</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Skills
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/4 border border-white/8 px-3 py-4 shadow-soft">
              <div className="text-lg font-semibold">2</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Windows
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/4 border border-white/8 px-3 py-4 shadow-soft">
              <div className="text-lg font-semibold">Live</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                Status
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold tracking-tight">Lifetime impact</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                A premium volunteer portfolio view for demos and profile storytelling.
              </p>
            </div>
            <Badge tone="neutral">Showcase</Badge>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {impactStats.map((stat) => {
              const Icon = stat.icon;
              const toneMap = {
                emerald:
                  "bg-[oklch(0.7_0.16_160_/_0.14)] text-[oklch(0.45_0.16_160)]",
                blue:
                  "bg-[oklch(0.62_0.18_255_/_0.12)] text-[oklch(0.5_0.2_265)]",
                amber:
                  "bg-[oklch(0.82_0.16_75_/_0.18)] text-[oklch(0.5_0.18_60)]",
                rose:
                  "bg-[oklch(0.68_0.2_20_/_0.14)] text-[oklch(0.5_0.22_20)]",
              } as const;

              return (
                <div
                  key={stat.label}
                  className="rounded-[1.5rem] border border-border/70 bg-white/4 border border-white/8 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl shadow-soft ${toneMap[stat.tone]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge tone={stat.tone}>{stat.note}</Badge>
                  </div>

                  <div className="mt-5 text-3xl font-semibold tracking-tight">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-white/4 border border-white/8 p-4 shadow-soft">
              <div className="text-xs text-muted-foreground">Weekday window</div>
              <div className="mt-1 font-medium">6 PM - 10 PM</div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-white/4 border border-white/8 p-4 shadow-soft">
              <div className="text-xs text-muted-foreground">Weekend window</div>
              <div className="mt-1 font-medium">All day</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border/70 bg-white/4 border border-white/8 p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-[oklch(0.5_0.16_160)]" />
              <div className="text-sm font-semibold tracking-tight">
                Skills & availability
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "First aid",
                "Driving",
                "Hindi",
                "Tamil",
                "Logistics",
                "Coordination",
                "Lifting",
              ].map((skill) => (
                <Badge key={skill} tone="blue">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
