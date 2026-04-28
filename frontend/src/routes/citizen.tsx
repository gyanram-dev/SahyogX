import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  MapPin,
  Upload,
  AlertTriangle,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
} from "lucide-react";
import { apiUrl } from "@/lib/api";

export const Route = createFileRoute("/citizen")({
  head: () => ({ meta: [{ title: "Raise a Request - Citizen" }] }),
  component: Citizen,
});

const categories = [
  "Medical",
  "Food & water",
  "Shelter",
  "Rescue",
  "Power / Utility",
  "Other",
];

const urgencies = [
  {
    v: "Critical",
    desc: "Immediate threat to life",
    tone: "bg-[oklch(0.68_0.2_20_/_0.12)] text-[oklch(0.5_0.22_20)] border-[oklch(0.68_0.2_20_/_0.4)]",
  },
  {
    v: "High",
    desc: "Within a few hours",
    tone: "bg-[oklch(0.82_0.16_75_/_0.18)] text-[oklch(0.5_0.18_60)] border-[oklch(0.82_0.16_75_/_0.4)]",
  },
  {
    v: "Medium",
    desc: "Today",
    tone: "bg-[oklch(0.62_0.18_255_/_0.1)] text-[oklch(0.5_0.2_265)] border-[oklch(0.62_0.18_255_/_0.4)]",
  },
  {
    v: "Low",
    desc: "This week",
    tone: "bg-muted text-muted-foreground border-border",
  },
];

function Citizen() {
  const [cat, setCat] = useState("Medical");
  const [urg, setUrg] = useState("High");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<{
    id: number;
    status: string;
    need_type: string;
    location: string;
  } | null>(null);

  const submitRequest = async () => {
    const urgencyMap = {
      Critical: 10,
      High: 8,
      Medium: 6,
      Low: 4,
    };

    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the situation");
      return;
    }

    const payload = {
      need_type: cat,
      location,
      urgency: urgencyMap[urg as keyof typeof urgencyMap],
      skill_required: cat,
      description,
    };

    try {
      setLoading(true);
      setMessage("");
      setReceipt(null);

      const res = await fetch(apiUrl("/request"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      const data = await res.json();

      if (data?.request?.id) {
        setReceipt({
          id: data.request.id,
          status: data.request.status || "Raised",
          need_type: data.request.need_type || cat,
          location: data.request.location || location,
        });
      }

      setMessage("Request submitted successfully. Your request is now in the NGO review queue.");
      setLocation("");
      setDescription("");
      setCat("Medical");
      setUrg("High");
    } catch (error) {
      console.log(error);
      setMessage("Backend connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-3.5 py-2 text-sm text-muted-foreground shadow-soft transition hover:-translate-y-0.5 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-amber shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-semibold tracking-tight">SahyogX</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Citizen Request Desk
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section>
            <div className="rounded-[2rem] panel-premium p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
                <ShieldCheck className="h-3 w-3 text-[oklch(0.5_0.16_160)]" />
                Verified response workflow
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight lg:text-5xl">
                Raise an emergency request with clarity.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground lg:text-base">
                Share the need, location, urgency, and on-ground context in one structured flow so NGO coordinators can review and route it quickly.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    icon: ClipboardCheck,
                    title: "Structured intake",
                    copy: "Requests enter the system with category, urgency, and location already standardized.",
                  },
                  {
                    icon: Clock3,
                    title: "Faster review",
                    copy: "Coordinators see the request immediately and can move it into review and assignment.",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Traceable status",
                    copy: "Every request receives a live reference ID and visible status trail for follow-up.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border/70 bg-white/65 p-4 shadow-soft"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl gradient-amber text-white shadow-soft">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="mt-3 text-sm font-semibold tracking-tight">{item.title}</div>
                      <p className="mt-1.5 text-xs leading-6 text-muted-foreground">{item.copy}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs font-medium text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-[oklch(0.5_0.16_160)]" />
                Encrypted · Verified responders only
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight">Submit your request</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                The more precise the details, the faster the coordination team can act.
              </p>
            </div>

            <div className="rounded-[2rem] panel-premium p-6 lg:p-8 space-y-7">
              <section className="rounded-2xl border border-border/70 bg-white/60 p-5 shadow-soft">
                <SectionTitle
                  title="Need details"
                  subtitle="Choose the help type and urgency so the request lands in the right review queue."
                />

                <div>
                  <Label>Category</Label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCat(c)}
                        className={`rounded-2xl border px-3 py-3 text-sm font-medium transition ${
                          cat === c
                            ? "border-accent bg-accent/10 text-foreground shadow-soft"
                            : "border-border/80 bg-background/80 hover:-translate-y-0.5 hover:bg-white"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <Label>Location</Label>
                  <div className="mt-3 flex gap-2">
                    <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl border border-border/80 bg-background/80 px-3 shadow-soft">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none"
                        placeholder="Address or landmark"
                      />
                    </div>

                    <button
                      disabled
                      className="h-12 whitespace-nowrap rounded-2xl border border-border/80 bg-background/80 px-4 text-xs font-medium text-muted-foreground shadow-soft opacity-70"
                    >
                      GPS Coming Soon
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <Label>Urgency</Label>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {urgencies.map((u) => (
                      <button
                        key={u.v}
                        onClick={() => setUrg(u.v)}
                        className={`rounded-2xl border p-3 text-left transition ${
                          urg === u.v
                            ? `${u.tone} shadow-soft`
                            : "border-border/80 bg-background/80 text-muted-foreground hover:-translate-y-0.5 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                          {u.v === "Critical" && <AlertTriangle className="h-3.5 w-3.5" />}
                          {u.v}
                        </div>
                        <div className="mt-0.5 text-[11px] opacity-80">{u.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/70 bg-white/60 p-5 shadow-soft">
                <SectionTitle
                  title="Situation context"
                  subtitle="Describe what is happening and add a photo if it helps responders verify the ground situation."
                />

                <div>
                  <Label>What's happening?</Label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="mt-3 w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm outline-none shadow-soft transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Describe the situation, who needs help, immediate constraints, and any access details."
                  />
                </div>

                <div className="mt-5">
                  <Label>Photo (optional)</Label>
                  <label className="mt-3 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 bg-background/80 transition hover:bg-white">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <div className="text-xs font-medium text-muted-foreground">Tap to upload an image</div>
                    <div className="text-[11px] text-muted-foreground">JPG, PNG, or HEIC</div>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </section>

              <button
                onClick={submitRequest}
                disabled={loading}
                className="w-full rounded-2xl gradient-amber px-4 py-3.5 text-white font-semibold shadow-glow transition hover:-translate-y-0.5 hover:shadow-elevated disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit request for review"}
              </button>

              {message && (
                <div className="rounded-2xl border border-[oklch(0.85_0.17_80_/_0.35)] bg-[oklch(0.85_0.17_80_/_0.12)] px-4 py-3 text-sm font-medium text-[oklch(0.48_0.16_70)] shadow-soft">
                  {message}
                </div>
              )}

              {receipt && (
                <div className="rounded-[1.7rem] border border-[oklch(0.62_0.18_255_/_0.18)] bg-[oklch(0.62_0.18_255_/_0.08)] p-5 shadow-elevated">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.5_0.2_265)]">
                        Request receipt
                      </div>
                      <h2 className="mt-2 text-lg font-semibold tracking-tight">Reference #{receipt.id}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {receipt.need_type} request logged for {receipt.location}.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.68_0.2_20_/_0.2)] bg-[oklch(0.68_0.2_20_/_0.1)] px-3 py-1.5 text-xs font-semibold text-[oklch(0.5_0.22_20)] shadow-soft">
                      Current status: {receipt.status}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border/70 bg-background/70 px-4 py-4 shadow-soft">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Next step
                    </div>
                    <p className="mt-1 text-sm text-foreground">
                      An NGO coordinator will review this request, verify urgency, and move it into assignment for a volunteer responder.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-center text-[11px] leading-5 text-muted-foreground">
                By submitting, you agree to share your location with verified NGOs and volunteers responding to your request.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
      {children}
    </div>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-5">
      <div className="text-sm font-semibold tracking-tight">{title}</div>
      <p className="mt-1 text-xs leading-6 text-muted-foreground">{subtitle}</p>
    </div>
  );
}