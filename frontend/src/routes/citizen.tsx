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
import { apiUrl } from "@/hooks/lib/api";

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
    tone: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  },
  {
    v: "High",
    desc: "Within a few hours",
    tone: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  {
    v: "Medium",
    desc: "Today",
    tone: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    v: "Low",
    desc: "This week",
    tone: "bg-slate-700/50 text-slate-400 border-slate-600/30",
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
    if (!location.trim()) {
      alert("Please enter your location");
      return;
    }
    if (!description.trim()) {
      alert("Please describe the situation");
      return;
    }

    const urgencyMap: Record<string, number> = {
      Critical: 10,
      High: 8,
      Medium: 6,
      Low: 4,
    };

    const payload = {
      need_type: cat,
      location,
      urgency: urgencyMap[urg],
      skill_required: cat,
      description,
    };

    try {
      setLoading(true);
      setMessage("");
      setReceipt(null);

      const res = await fetch(apiUrl("/request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();

      if (data?.request?.id) {
        setReceipt({
          id: data.request.id,
          status: data.request.status || "Raised",
          need_type: data.request.need_type || cat,
          location: data.request.location || location,
        });
      }

      setMessage("Request submitted successfully! Your request is now in the NGO review queue.");
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
    <div className="min-h-screen bg-[#080c14] text-slate-200">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-teal-500/10 bg-slate-900/50 px-3.5 py-2 text-sm text-slate-400 transition hover:text-teal-400 hover:border-teal-500/30"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 shadow-teal-glow">
            <Sparkles className="h-4 w-4 text-black" />
          </div>
          <div>
            <div className="font-bold text-white tracking-wide">SahyogX</div>
            <div className="text-[10px] uppercase tracking-widest text-teal-500/60">
              Citizen Request Desk
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <section>
            <div className="rounded-2xl bg-[#0e1520] border border-teal-500/10 p-7 lg:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/10 bg-slate-900/50 px-3 py-1 text-xs font-medium text-teal-500/60">
                <ShieldCheck className="h-3 w-3" />
                Verified response workflow
              </div>

              <h1 className="mt-5 text-4xl font-bold tracking-wide text-white lg:text-5xl">
                Raise an emergency request with clarity.
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 lg:text-base">
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
                      className="rounded-xl border border-teal-500/10 bg-slate-900/30 p-4"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="mt-3 text-sm font-bold text-white">{item.title}</div>
                      <p className="mt-1.5 text-xs leading-6 text-slate-500">{item.copy}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section>
            <div className="mb-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/10 bg-slate-900/50 px-3 py-1 text-xs font-medium text-teal-500/60">
                <ShieldCheck className="h-3 w-3" />
                Encrypted · Verified responders only
              </div>

              <h2 className="mt-5 text-3xl font-bold tracking-wide text-white">Submit your request</h2>
              <p className="mt-2 text-sm text-slate-400">
                The more precise the details, the faster the coordination team can act.
              </p>
            </div>

            <div className="rounded-2xl bg-[#0e1520] border border-teal-500/10 p-6 lg:p-8 space-y-6">
              <section className="rounded-xl border border-teal-500/10 bg-slate-900/30 p-5">
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-teal-500/60">Need details</div>
                  <p className="mt-1 text-xs leading-6 text-slate-500">Choose the help type and urgency so the request lands in the right review queue.</p>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Category</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCat(c)}
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition ${
                          cat === c
                            ? "border-teal-400 bg-teal-500/10 text-teal-400"
                            : "border-teal-500/10 bg-slate-900/30 text-slate-400 hover:border-teal-500/30 hover:text-slate-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Location</div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-12 rounded-xl border border-teal-500/10 bg-slate-900 px-4 text-sm text-white placeholder:text-slate-500"
                    placeholder="Address or landmark"
                  />
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Urgency</div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {urgencies.map((u) => (
                      <button
                        key={u.v}
                        onClick={() => setUrg(u.v)}
                        className={`rounded-xl border p-3 text-left transition ${
                          urg === u.v
                            ? u.tone
                            : "border-teal-500/10 bg-slate-900/30 text-slate-400 hover:border-teal-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-sm font-semibold">
                          {u.v === "Critical" && <AlertTriangle className="h-3.5 w-3.5" />}
                          {u.v}
                        </div>
                        <div className="mt-0.5 text-[10px] opacity-80">{u.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-teal-500/10 bg-slate-900/30 p-5">
                <div className="mb-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-teal-500/60">Situation context</div>
                  <p className="mt-1 text-xs leading-6 text-slate-500">Describe what is happening and add a photo if it helps responders verify.</p>
                </div>

                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">What's happening?</div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-teal-500/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500"
                    placeholder="Describe the situation, who needs help, immediate constraints, and any access details."
                  />
                </div>

                <div className="mt-5">
                  <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Photo (optional)</div>
                  <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-teal-500/10 bg-slate-900/30 hover:border-teal-500/30">
                    <Upload className="h-5 w-5 text-slate-500" />
                    <div className="text-xs font-medium text-slate-400">Tap to upload an image</div>
                    <div className="text-[10px] text-slate-500">JPG, PNG, or HEIC</div>
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              </section>

              <button
                onClick={submitRequest}
                disabled={loading}
                className="w-full rounded-xl bg-teal-500 px-4 py-3.5 text-black font-semibold transition hover:bg-teal-400 disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit request for review"}
              </button>

              {message && (
                <div className="rounded-xl border border-teal-500/20 bg-teal-500/10 px-4 py-3 text-sm font-medium text-teal-400">
                  {message}
                </div>
              )}

              {receipt && (
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-widest text-blue-400">
                        Request receipt
                      </div>
                      <h2 className="mt-2 text-lg font-bold text-white">Reference #{receipt.id}</h2>
                      <p className="mt-1 text-sm text-slate-400">
                        {receipt.need_type} request logged for {receipt.location}.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-400">
                      Current status: {receipt.status}
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-teal-500/10 bg-slate-900/50 px-4 py-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Next step
                    </div>
                    <p className="mt-1 text-sm text-slate-300">
                      An NGO coordinator will review this request, verify urgency, and move it into assignment for a volunteer responder.
                    </p>
                  </div>
                </div>
              )}

              <p className="text-center text-[10px] leading-5 text-slate-500">
                By submitting, you agree to share your location with verified NGOs and volunteers responding to your request.
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}