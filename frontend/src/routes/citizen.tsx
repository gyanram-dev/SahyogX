import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, MapPin, Upload, AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/citizen")({
  head: () => ({ meta: [{ title: "Raise a request — Citizen" }] }),
  component: Citizen,
});

const categories = ["Medical", "Food & water", "Shelter", "Rescue", "Power / Utility", "Other"];
const urgencies = [
  { v: "Critical", desc: "Immediate threat to life", tone: "bg-[oklch(0.68_0.2_20_/_0.12)] text-[oklch(0.5_0.22_20)] border-[oklch(0.68_0.2_20_/_0.4)]" },
  { v: "High", desc: "Within a few hours", tone: "bg-[oklch(0.82_0.16_75_/_0.18)] text-[oklch(0.5_0.18_60)] border-[oklch(0.82_0.16_75_/_0.4)]" },
  { v: "Medium", desc: "Today", tone: "bg-[oklch(0.62_0.18_255_/_0.1)] text-[oklch(0.5_0.2_265)] border-[oklch(0.62_0.18_255_/_0.4)]" },
  { v: "Low", desc: "This week", tone: "bg-muted text-muted-foreground border-border" },
];

function Citizen() {
  const [cat, setCat] = useState("Medical");
  const [urg, setUrg] = useState("High");
  return (
    <div className="min-h-screen gradient-hero">
      <header className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl gradient-amber flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight">SahyogX <span className="text-muted-foreground font-normal">Citizen</span></span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-4">
            <ShieldCheck className="h-3 w-3 text-[oklch(0.5_0.16_160)]" />
            Encrypted · Verified responders only
          </div>
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight">Raise an emergency request</h1>
          <p className="text-muted-foreground mt-2 text-sm">Tell us what's happening. We'll match the nearest responder in seconds.</p>
        </div>

        <div className="rounded-3xl glass shadow-elevated p-6 lg:p-8 space-y-6">
          {/* Category */}
          <div>
            <Label>Category</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition ${
                    cat === c ? "border-accent bg-accent/10 text-foreground shadow-soft" : "border-border bg-card hover:bg-muted"
                  }`}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <div className="mt-2 flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 h-11 rounded-xl border border-border bg-card">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <input className="flex-1 bg-transparent outline-none text-sm" placeholder="Address or landmark" />
              </div>
              <button className="px-3 h-11 rounded-xl border border-border bg-card text-xs font-medium hover:bg-muted whitespace-nowrap">
                Use GPS
              </button>
            </div>
          </div>

          {/* Urgency */}
          <div>
            <Label>Urgency</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {urgencies.map((u) => (
                <button
                  key={u.v}
                  onClick={() => setUrg(u.v)}
                  className={`p-3 rounded-xl border text-left transition ${urg === u.v ? u.tone + " shadow-soft" : "border-border bg-card hover:bg-muted text-muted-foreground"}`}
                >
                  <div className="text-sm font-semibold flex items-center gap-1.5">
                    {u.v === "Critical" && <AlertTriangle className="h-3.5 w-3.5" />}
                    {u.v}
                  </div>
                  <div className="text-[11px] mt-0.5 opacity-80">{u.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>What's happening?</Label>
            <textarea
              rows={4}
              className="mt-2 w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:ring-2 focus:ring-accent/30"
              placeholder="Describe the situation, who needs help, any specifics…"
            />
          </div>

          {/* Upload */}
          <div>
            <Label>Photo (optional)</Label>
            <label className="mt-2 flex flex-col items-center justify-center gap-2 h-28 rounded-xl border border-dashed border-border bg-card hover:bg-muted/50 cursor-pointer transition">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="text-xs text-muted-foreground">Tap to upload an image</div>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <button className="w-full h-12 rounded-xl gradient-amber text-white font-semibold shadow-glow hover:shadow-elevated transition">
            Send request — match responder
          </button>
          <p className="text-[11px] text-muted-foreground text-center">
            By submitting, you agree to share your location with verified NGOs and volunteers responding to your request.
          </p>
        </div>
      </main>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>;
}