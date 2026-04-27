import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Sparkles,
  Zap,
  MapPin,
  Siren,
  Clock,
  CheckCircle2,
  Star,
  LifeBuoy,
  Stethoscope,
  Utensils,
  Droplets,
  Radio,
  Brain,
  Send,
  TrendingUp,
  Cpu,
  Lock,
} from "lucide-react";
import featureCitizen from "@/assets/feature-citizen.png";
import featureVolunteer from "@/assets/feature-volunteer.png";
import heroTeam from "@/assets/hero-team.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SahyogX - Coordinate Relief Faster, With Clarity and Accountability" },
      {
        name: "description",
        content:
          "A live coordination platform for citizen requests, NGO triage, volunteer dispatch, and end-to-end relief tracking.",
      },
    ],
  }),
  component: Index,
});

/* --- Animated counter --- */
function Counter({
  to,
  suffix = "",
  duration = 1800,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

const ctas = [
  {
    title: "Request Help",
    desc: "Submit verified needs with urgency and location.",
    icon: Siren,
    to: "/citizen",
    gradient: "from-[oklch(0.78_0.18_55)] to-[oklch(0.65_0.22_30)]",
    ring: "oklch(0.7 0.2 40 / 0.35)",
  },
  {
    title: "Accept Missions",
    desc: "Receive tasks matched to your skills and availability.",
    icon: HeartHandshake,
    to: "/volunteer",
    gradient: "from-[oklch(0.72_0.16_160)] to-[oklch(0.6_0.18_180)]",
    ring: "oklch(0.7 0.16 160 / 0.35)",
  },
  {
    title: "Run Operations",
    desc: "Triage, assign, and close requests from one command center.",
    icon: Building2,
    to: "/ngo",
    gradient: "from-[oklch(0.62_0.18_255)] to-[oklch(0.42_0.2_275)]",
    ring: "oklch(0.62 0.18 255 / 0.35)",
  },
] as const;

const stats = [
  { v: 14, suffix: "", label: "Cities live" },
  { v: 2847, suffix: "+", label: "Active volunteers" },
  { v: 816, suffix: "+", label: "Requests resolved" },
  { v: 98, suffix: "%", label: "Success rate" },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: EASE },
} as const;

const orbitIcons = [
  { Icon: LifeBuoy, color: "oklch(0.78 0.18 55)", angle: 0 },
  { Icon: Stethoscope, color: "oklch(0.7 0.16 160)", angle: 72 },
  { Icon: Utensils, color: "oklch(0.82 0.16 75)", angle: 144 },
  { Icon: Droplets, color: "oklch(0.62 0.18 255)", angle: 216 },
  { Icon: HeartHandshake, color: "oklch(0.65 0.2 350)", angle: 288 },
] as const;

/* ============== Live dashboard mock (coded, not image) ============== */
function LiveDashboard() {
  const kpis = [
    { label: "Live requests", value: 128, suffix: "", delta: "+12", color: "oklch(0.74 0.19 50)", icon: Siren },
    { label: "Volunteers active", value: 412, suffix: "", delta: "+38", color: "oklch(0.72 0.17 162)", icon: HeartHandshake },
    { label: "Avg match time", value: 12, suffix: "s", delta: "−22%", color: "oklch(0.64 0.19 258)", icon: Clock },
    { label: "Success rate", value: 98, suffix: "%", delta: "+1.4%", color: "oklch(0.74 0.13 210)", icon: TrendingUp },
  ];

  const requests = [
    { name: "Aanya Rao",     loc: "Andheri E.",  cat: "Medical", eta: "4 min",  urgent: true,  c: "oklch(0.74 0.19 50)" },
    { name: "Vikram Shah",   loc: "Bandra W.",   cat: "Food",    eta: "9 min",  urgent: false, c: "oklch(0.82 0.16 75)" },
    { name: "Priya Nair",    loc: "Dadar",       cat: "Rescue",  eta: "2 min",  urgent: true,  c: "oklch(0.7 0.22 30)" },
    { name: "Mehul Patel",   loc: "Powai",       cat: "Shelter", eta: "12 min", urgent: false, c: "oklch(0.64 0.19 258)" },
  ];

  // Response time line (7 days, seconds)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const respPts = [18, 16, 19, 14, 13, 12, 11];
  const lineMax = 22;
  const linePoints = respPts
    .map((v, i) => `${(i * 320) / 6},${70 - ((v - 8) / (lineMax - 8)) * 60}`)
    .join(" ");
  const lineArea = `0,70 ${linePoints} 320,70`;

  // Bar chart — requests by category
  const cats = [
    { label: "Food",    v: 84, c: "oklch(0.82 0.16 75)" },
    { label: "Medical", v: 62, c: "oklch(0.74 0.19 50)" },
    { label: "Rescue",  v: 38, c: "oklch(0.7 0.22 30)" },
    { label: "Shelter", v: 27, c: "oklch(0.64 0.19 258)" },
  ];
  const barMax = Math.max(...cats.map((c) => c.v));

  // Donut — volunteer availability
  const donut = [
    { label: "Available",  v: 62, c: "oklch(0.72 0.17 162)" },
    { label: "On mission", v: 28, c: "oklch(0.64 0.19 258)" },
    { label: "Off-duty",   v: 10, c: "oklch(0.78 0.02 250)" },
  ];
  const donutTotal = donut.reduce((s, d) => s + d.v, 0);
  let donutAcc = 0;
  const donutR = 38;
  const donutC = 2 * Math.PI * donutR;

  // Map pins
  const pins = [
    { x: 18, y: 28, c: "oklch(0.7 0.22 30)", urgent: true },
    { x: 42, y: 52, c: "oklch(0.72 0.17 162)" },
    { x: 64, y: 30, c: "oklch(0.82 0.16 75)" },
    { x: 78, y: 62, c: "oklch(0.64 0.19 258)" },
    { x: 30, y: 70, c: "oklch(0.74 0.13 210)" },
  ];
  const routePath = "M40,160 C90,140 130,80 180,90 C230,100 260,40 320,55";
  const routePath2 = "M60,40 C110,70 160,140 220,150 C260,156 290,180 330,170";

  return (
    <div className="relative rounded-[1.75rem] bg-card border border-border shadow-elevated overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-gradient-to-b from-muted/40 to-transparent">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.7_0.22_30)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.82_0.16_75)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.72_0.17_162)]" />
          </div>
          <span className="ml-3 text-[11px] font-medium text-muted-foreground">
            sahyogx / command-center
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="hidden sm:inline">Mumbai · Region NW</span>
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.72_0.17_162)] opacity-70 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.72_0.17_162)]" />
            </span>
            Live
          </span>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 pt-5">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
              className="relative rounded-2xl border border-border bg-background/70 px-4 py-3.5 hover:shadow-soft transition"
            >
              <div className="flex items-center justify-between">
                <div
                  className="h-7 w-7 rounded-lg flex items-center justify-center"
                  style={{ background: `color-mix(in oklab, ${k.color} 14%, transparent)`, color: k.color }}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{
                    color: "oklch(0.45 0.16 162)",
                    background: "oklch(0.72 0.17 162 / 0.12)",
                  }}
                >
                  {k.delta}
                </span>
              </div>
              <div
                className="mt-2 text-[22px] font-semibold tracking-tight tabular-nums"
                style={{ color: k.color }}
              >
                <Counter to={k.value} suffix={k.suffix} />
              </div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground mt-0.5">
                {k.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Map + Live requests */}
      <div className="grid lg:grid-cols-5 gap-4 p-5">
        {/* Map */}
        <div className="lg:col-span-3 relative rounded-2xl border border-border overflow-hidden bg-gradient-to-br from-[oklch(0.97_0.015_220)] to-[oklch(0.95_0.025_200)] aspect-[16/10]">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.22 0.07 260 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.22 0.07 260 / 0.05) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />
          {/* Stylised "roads" */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 200" preserveAspectRatio="none">
            <path d="M0,70 L340,90" stroke="oklch(0.22 0.07 260 / 0.08)" strokeWidth="14" />
            <path d="M0,140 L340,130" stroke="oklch(0.22 0.07 260 / 0.06)" strokeWidth="10" />
            <path d="M120,0 L130,200" stroke="oklch(0.22 0.07 260 / 0.07)" strokeWidth="12" />
            <path d="M240,0 L250,200" stroke="oklch(0.22 0.07 260 / 0.06)" strokeWidth="9" />
          </svg>
          {/* Heat zones */}
          <div className="absolute h-40 w-40 rounded-full blur-3xl bg-[oklch(0.7_0.22_30/0.35)] top-[8%] left-[8%]" />
          <div className="absolute h-44 w-44 rounded-full blur-3xl bg-[oklch(0.72_0.17_162/0.30)] top-[35%] left-[34%]" />
          <div className="absolute h-36 w-36 rounded-full blur-3xl bg-[oklch(0.64_0.19_258/0.28)] top-[48%] left-[66%]" />

          {/* Animated dotted routes */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 200" preserveAspectRatio="none">
            <motion.path
              d={routePath}
              fill="none"
              stroke="oklch(0.64 0.19 258 / 0.7)"
              strokeWidth="1.6"
              strokeDasharray="4 6"
              initial={{ strokeDashoffset: 200 }}
              animate={{ strokeDashoffset: 0 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
              d={routePath2}
              fill="none"
              stroke="oklch(0.72 0.17 162 / 0.65)"
              strokeWidth="1.4"
              strokeDasharray="3 8"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 200 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            />
            {/* Moving dot along route 1 */}
            <motion.circle
              r="3.2"
              fill="oklch(0.64 0.19 258)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <animateMotion dur="6s" repeatCount="indefinite" path={routePath} />
            </motion.circle>
            <motion.circle
              r="2.8"
              fill="oklch(0.72 0.17 162)"
            >
              <animateMotion dur="7s" repeatCount="indefinite" path={routePath2} />
            </motion.circle>
          </svg>

          {/* Pins */}
          {pins.map((p, i) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="relative flex h-3 w-3">
                {p.urgent && (
                  <span
                    className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping"
                    style={{ background: p.c }}
                  />
                )}
                <span
                  className="relative inline-flex h-3 w-3 rounded-full ring-2 ring-background"
                  style={{ background: p.c, boxShadow: `0 0 12px ${p.c}` }}
                />
              </span>
            </div>
          ))}

          {/* Floating popup */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-3 right-3 glass rounded-xl px-3 py-2 shadow-soft text-[11px]"
          >
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.22_30)]" />
              Urgent zone — Andheri E.
            </div>
            <div className="text-muted-foreground">3 active · 7 volunteers in range</div>
          </motion.div>

          {/* Bottom legend */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-muted-foreground glass rounded-lg px-2.5 py-1.5">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.7_0.22_30)]" />Urgent</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.64_0.19_258)]" />Routed</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.17_162)]" />Volunteer</span>
          </div>
        </div>

        {/* Recent requests table */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold tracking-tight">Recent requests</div>
            <span className="text-[10.5px] text-muted-foreground">Coordinated live</span>
          </div>
          <div className="space-y-2">
            {requests.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * i, duration: 0.45, ease: EASE }}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 hover:shadow-soft hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-[12px] font-semibold ring-2 ring-background"
                  style={{ background: r.c }}
                >
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-semibold leading-tight truncate">
                    {r.name}
                  </div>
                  <div className="text-[10.5px] text-muted-foreground truncate">
                    {r.cat} · {r.loc} · ETA {r.eta}
                  </div>
                </div>
                {r.urgent ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[oklch(0.7_0.22_30/0.12)] text-[oklch(0.55_0.22_30)] uppercase tracking-wider">
                    Urgent
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[oklch(0.72_0.17_162/0.12)] text-[oklch(0.45_0.16_162)] uppercase tracking-wider">
                    Routed
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row: line + bar + donut */}
      <div className="grid lg:grid-cols-3 gap-4 px-5 pb-5">
        {/* Line chart — response time 7d */}
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                Response time · 7 days
              </div>
              <div className="text-base font-semibold tracking-tight">
                Avg <span className="text-gradient-brand">13.2s</span>
                <span className="text-[10px] font-medium text-[oklch(0.45_0.16_162)] ml-2">−22%</span>
              </div>
            </div>
            <TrendingUp className="h-4 w-4 text-[oklch(0.72_0.17_162)]" />
          </div>
          <svg viewBox="0 0 320 80" className="w-full h-20">
            <defs>
              <linearGradient id="lineFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.64 0.19 258 / 0.35)" />
                <stop offset="100%" stopColor="oklch(0.64 0.19 258 / 0)" />
              </linearGradient>
            </defs>
            {/* gridlines */}
            {[20, 40, 60].map((y) => (
              <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="oklch(0.22 0.07 260 / 0.06)" strokeDasharray="2 4" />
            ))}
            <motion.polygon
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              points={lineArea}
              fill="url(#lineFill)"
            />
            <motion.polyline
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE }}
              points={linePoints}
              fill="none"
              stroke="oklch(0.64 0.19 258)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {respPts.map((v, i) => {
              const x = (i * 320) / 6;
              const y = 70 - ((v - 8) / (lineMax - 8)) * 60;
              return (
                <motion.circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="2.5"
                  fill="white"
                  stroke="oklch(0.64 0.19 258)"
                  strokeWidth="1.5"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 + i * 0.05 }}
                />
              );
            })}
          </svg>
          <div className="flex justify-between text-[9.5px] text-muted-foreground mt-1">
            {days.map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Bar chart — by category */}
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                Requests by category
              </div>
              <div className="text-base font-semibold tracking-tight">211 total · today</div>
            </div>
          </div>
          <div className="space-y-2.5 mt-3">
            {cats.map((c, i) => {
              const w = (c.v / barMax) * 100;
              return (
                <div key={c.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="font-medium" style={{ color: "oklch(0.21 0.07 265)" }}>{c.label}</span>
                    <span className="text-muted-foreground tabular-nums">{c.v}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${w}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.2 + i * 0.08, ease: EASE }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${c.c}, color-mix(in oklab, ${c.c} 70%, white))` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut — volunteer availability */}
        <div className="rounded-2xl border border-border bg-background/70 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-[10.5px] uppercase tracking-wider text-muted-foreground">
                Volunteer availability
              </div>
              <div className="text-base font-semibold tracking-tight">412 active</div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
              <circle cx="50" cy="50" r={donutR} fill="none" stroke="oklch(0.94 0.01 240)" strokeWidth="14" />
              {donut.map((d) => {
                const len = (d.v / donutTotal) * donutC;
                const offset = donutAcc;
                donutAcc += len;
                return (
                  <motion.circle
                    key={d.label}
                    cx="50"
                    cy="50"
                    r={donutR}
                    fill="none"
                    stroke={d.c}
                    strokeWidth="14"
                    strokeLinecap="butt"
                    strokeDasharray={`${len} ${donutC - len}`}
                    strokeDashoffset={-offset}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                );
              })}
            </svg>
            <div className="flex-1 space-y-1.5">
              {donut.map((d) => (
                <div key={d.label} className="flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-sm" style={{ background: d.c }} />
                    <span className="font-medium" style={{ color: "oklch(0.21 0.07 265)" }}>{d.label}</span>
                  </span>
                  <span className="text-muted-foreground tabular-nums">{d.v}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============== Page ============== */
function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 ambient-gradient" />
        <div
          className="float-shape h-[520px] w-[520px] -top-40 -left-40 bg-[oklch(0.78_0.14_250/0.45)]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="float-shape h-[480px] w-[480px] top-20 right-[-180px] bg-[oklch(0.78_0.14_165/0.40)]"
          style={{ animationDelay: "-6s", animationDuration: "22s" }}
        />
        <div
          className="float-shape h-[420px] w-[420px] top-[40%] left-[30%] bg-[oklch(0.85_0.14_70/0.30)]"
          style={{ animationDelay: "-12s", animationDuration: "26s" }}
        />
      </div>
      <div className="absolute inset-0 grid-bg opacity-[0.18] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-20 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-semibold tracking-tight text-[15px]">
            SahyogX <span className="text-muted-foreground font-normal">Coordination</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a className="hover:text-foreground transition" href="#how">
            How it works
          </a>
          <a className="hover:text-foreground transition" href="#portals">
            Portals
          </a>
          <a className="hover:text-foreground transition" href="#dashboard">
            Dashboard
          </a>
          <a className="hover:text-foreground transition" href="#trust">
            Trust
          </a>
        </div>
        <Link
          to="/ngo"
          className="text-sm font-medium px-4 py-2 rounded-xl bg-foreground text-background hover:opacity-90 transition shadow-soft"
        >
          Open Command Center
        </Link>
      </nav>

      {/* ============== HERO ============== */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-6 lg:pt-10 pb-14">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <motion.div
            className="lg:col-span-7 text-center lg:text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="urgent-pulse inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-5"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.72_0.17_162)] opacity-60 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[oklch(0.72_0.17_162)]" />
              </span>
              Live relief coordination · Verified NGO and volunteer network
            </motion.div>

            <h1 className="text-[2.6rem] leading-[1.05] sm:text-5xl lg:text-[4.5rem] lg:leading-[1.02] font-semibold tracking-tight">
              Coordinate Relief.
              <br />
              Dispatch The <span className="text-gradient-brand">Right Team</span>.
              <br />
              Track Every Outcome.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              SahyogX turns citizen requests into accountable field action, helping NGOs triage,
              assign, and monitor relief work from one live command layer.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
              <Link
                to="/citizen"
                className="cta-glow group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-elevated bg-gradient-to-br from-[oklch(0.78_0.19_55)] to-[oklch(0.65_0.21_38)] hover:opacity-95 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <Siren className="h-4 w-4" /> Request Help Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
              </Link>
              <Link
                to="/volunteer"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-soft bg-gradient-to-br from-[oklch(0.72_0.17_162)] to-[oklch(0.6_0.15_195)] hover:opacity-95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-elevated active:scale-[0.97]"
              >
                <HeartHandshake className="h-4 w-4" /> Start Volunteering
              </Link>
              <Link
                to="/ngo"
                className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-foreground bg-card border border-border hover:bg-muted/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft active:scale-[0.97]"
              >
                <Building2 className="h-4 w-4" /> View Command Center
              </Link>
            </div>

            <div className="mt-6 flex items-center gap-4 justify-center lg:justify-start text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {[
                  "oklch(0.72 0.17 162)",
                  "oklch(0.64 0.19 258)",
                  "oklch(0.74 0.19 50)",
                  "oklch(0.74 0.13 210)",
                ].map((c, i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-background"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-[oklch(0.82_0.16_75)] text-[oklch(0.82_0.16_75)]"
                  />
                ))}
                <span className="ml-1">Built for transparent, auditable relief operations</span>
              </div>
            </div>
          </motion.div>

          {/* Hero illustration */}
          <motion.div
            className="lg:col-span-5 relative -mt-4 lg:-mt-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glowing route lines behind group */}
              <svg
                className="absolute inset-0 -z-10 w-full h-full"
                viewBox="0 0 400 400"
                preserveAspectRatio="none"
                aria-hidden
              >
                <defs>
                  <linearGradient id="routeA" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.64 0.19 258 / 0.0)" />
                    <stop offset="50%" stopColor="oklch(0.64 0.19 258 / 0.7)" />
                    <stop offset="100%" stopColor="oklch(0.72 0.17 162 / 0.0)" />
                  </linearGradient>
                  <linearGradient id="routeB" x1="1" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.74 0.13 210 / 0.0)" />
                    <stop offset="50%" stopColor="oklch(0.74 0.13 210 / 0.6)" />
                    <stop offset="100%" stopColor="oklch(0.74 0.19 50 / 0.0)" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M40,320 C120,260 180,200 260,220 C320,235 360,180 380,120"
                  fill="none"
                  stroke="url(#routeA)"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  initial={{ strokeDashoffset: 200 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M20,140 C100,180 160,260 240,260 C310,260 350,300 390,330"
                  fill="none"
                  stroke="url(#routeB)"
                  strokeWidth="2"
                  strokeDasharray="4 10"
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 200 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                />
              </svg>
              <div className="absolute inset-x-0 bottom-0 -z-10 h-[70%] blur-3xl opacity-80 bg-gradient-to-br from-[oklch(0.74_0.13_210/0.6)] via-[oklch(0.72_0.17_162/0.5)] to-[oklch(0.74_0.19_50/0.4)] rounded-[40%]" />
              <img
                src={heroTeam}
                alt="Diverse NGO team of coordinators, volunteers and a logistics helper collaborating on relief operations"
                width={1280}
                height={1280}
                className="w-full h-auto drop-shadow-[0_30px_40px_oklch(0.22_0.06_265/0.22)]"
              />

              <motion.div
                className="pointer-events-none absolute inset-x-0 top-0 h-[55%]"
                animate={{ rotate: 360 }}
                transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
              >
                {orbitIcons.map(({ Icon, color, angle }, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      transform: `rotate(${angle}deg) translate(0, -120%) rotate(-${angle}deg)`,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                      className="-translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-2xl glass shadow-elevated flex items-center justify-center"
                    >
                      <Icon style={{ color, width: 18, height: 18 }} />
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute top-4 left-0 sm:left-2 glass rounded-2xl px-3.5 py-2.5 shadow-elevated flex items-center gap-2.5"
            >
              <div className="h-8 w-8 rounded-lg gradient-emerald flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-muted-foreground leading-none">Matched in</div>
                <div className="text-sm font-semibold tracking-tight">12 seconds</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-6 right-0 sm:right-2 glass rounded-2xl px-3.5 py-2.5 shadow-elevated flex items-center gap-2.5"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[oklch(0.78_0.18_55)] to-[oklch(0.62_0.22_30)] flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-[11px] text-muted-foreground leading-none">Nearest helper</div>
                <div className="text-sm font-semibold tracking-tight">0.6 km away</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============== STATS PROOF BAR ============== */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 -mt-4 pb-12">
        <motion.div
          {...fadeUp}
          className="rounded-3xl glass p-6 lg:p-8 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-semibold tracking-tight text-gradient-brand">
                <Counter to={s.v} suffix={s.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============== HOW IT WORKS — 3 STEPS ============== */}
      <section id="how" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground mb-4">
            Operational workflow
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            From request to <span className="text-gradient-brand">verified resolution</span>.
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            A simple, accountable flow for intake, assignment, field execution, and closure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {[
            {
              step: "01",
              icon: Send,
              title: "Citizen reports the need",
              desc: "Capture category, urgency, location, and context so coordinators can act with clarity.",
              color: "oklch(0.7 0.22 30)",
              g: "from-[oklch(0.78_0.18_55)] to-[oklch(0.62_0.22_30)]",
            },
            {
              step: "02",
              icon: Brain,
              title: "NGO prioritizes and assigns",
              desc: "Coordinators review each request, assign the right responder, and keep ownership visible.",
              color: "oklch(0.62 0.18 255)",
              g: "from-[oklch(0.62_0.18_255)] to-[oklch(0.42_0.2_275)]",
            },
            {
              step: "03",
              icon: Radio,
              title: "Volunteer resolves the task",
              desc: "Volunteers accept, complete, and update work so every request has a measurable outcome.",
              color: "oklch(0.7 0.16 160)",
              g: "from-[oklch(0.72_0.16_160)] to-[oklch(0.55_0.16_180)]",
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                className="relative rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-elevated hover:-translate-y-1.5 transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.g} flex items-center justify-center shadow-soft`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span
                    className="text-xs font-bold tracking-widest"
                    style={{ color: s.color }}
                  >
                    STEP {s.step}
                  </span>
                </div>
                <div className="font-semibold text-lg tracking-tight">{s.title}</div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ============== THREE PORTALS ============== */}
      <section
        id="portals"
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20"
      >
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground mb-4">
            Three portals · One accountable workflow
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Start from the role that matches <span className="text-gradient-brand">your responsibility</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Citizens raise verified needs, NGOs coordinate response, and volunteers complete measurable field work.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {ctas.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.to}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
              >
                <Link
                  to={r.to}
                  className="group relative block rounded-3xl p-6 bg-card border border-border shadow-soft hover:shadow-elevated transition-all hover:-translate-y-1.5"
                >
                  <div
                    className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center mb-5`}
                    style={{ boxShadow: `0 8px 24px ${r.ring}` }}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="font-semibold text-lg tracking-tight">{r.title}</div>
                  <p className="text-sm text-muted-foreground mt-1.5">{r.desc}</p>
                  <div className="mt-6 flex items-center text-sm font-medium gap-1 opacity-70 group-hover:opacity-100 transition">
                    Continue{" "}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Citizen + Volunteer feature spotlights */}
        <div className="mt-24 space-y-24">
          {[
            {
              tag: "For Citizens",
              title: "Make urgent needs visible immediately",
              desc: "Submit location, category, urgency, and context in one flow so NGOs can review and act without phone-chain delays.",
              img: featureCitizen,
              accent: "from-[oklch(0.78_0.18_55)] to-[oklch(0.62_0.22_30)]",
              points: ["Structured request intake", "Live status updates", "Clear urgency signals"],
              reverse: false,
            },
            {
              tag: "For Volunteers",
              title: "Turn intent into completed missions",
              desc: "See assigned tasks, accept responsibility, and mark work complete so NGOs have a reliable ground-truth view.",
              img: featureVolunteer,
              accent: "from-[oklch(0.72_0.16_160)] to-[oklch(0.55_0.16_180)]",
              points: ["Assigned task queue", "Accept and complete workflow", "Accountable activity history"],
              reverse: true,
            },
          ].map((f) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                f.reverse ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground mb-4">
                  {f.tag}
                </div>
                <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-4 text-muted-foreground text-base sm:text-lg leading-relaxed">
                  {f.desc}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {f.points.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={`h-5 w-5 rounded-full bg-gradient-to-br ${f.accent} flex items-center justify-center`}
                      >
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-6 -z-10 rounded-[40%] blur-3xl opacity-60 bg-gradient-to-br ${f.accent}`}
                />
                <motion.img
                  src={f.img}
                  alt={f.title}
                  loading="lazy"
                  width={768}
                  height={768}
                  className="w-full max-w-md mx-auto h-auto drop-shadow-[0_20px_30px_oklch(0.22_0.06_265/0.18)]"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============== NGO DASHBOARD POWER SECTION ============== */}
      <section
        id="dashboard"
        className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24"
      >
        <motion.div
          {...fadeUp}
          className="relative dark-glass rounded-[2rem] p-6 sm:p-10 lg:p-14 overflow-hidden"
        >
          {/* Ambient lighting behind dashboard */}
          <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full blur-3xl bg-[oklch(0.64_0.19_258/0.45)]" />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full blur-3xl bg-[oklch(0.72_0.17_162/0.35)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.06] grid-bg" />

          <div className="relative text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[11px] font-medium px-3 py-1 rounded-full bg-white/10 text-white/80 border border-white/10 mb-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[oklch(0.72_0.17_162)] opacity-70 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[oklch(0.72_0.17_162)]" />
              </span>
              NGO Command Center · Live
            </div>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
              Built for the teams who{" "}
              <span className="bg-gradient-to-r from-[oklch(0.85_0.12_220)] via-white to-[oklch(0.85_0.14_165)] bg-clip-text text-transparent">
                own the outcome.
              </span>
            </h2>
            <p className="mt-4 text-white/70 text-base sm:text-lg">
              One operational layer for triage, assignment, volunteer execution, and closure.
            </p>
          </div>

          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <motion.div {...fadeUp} className="lg:col-span-7">
              <LiveDashboard />
            </motion.div>

            <motion.div {...fadeUp} className="lg:col-span-5 text-white">
              <ul className="space-y-4">
              {[
                {
                  t: "Real-time request visibility",
                  d: "Track every open, assigned, accepted, and completed request as the situation changes.",
                },
                {
                  t: "Faster field coordination",
                  d: "Move from review to assignment with clear status ownership and fewer manual handoffs.",
                },
                {
                  t: "Volunteer task accountability",
                  d: "See which tasks are accepted, completed, and ready for NGO closure.",
                },
                {
                  t: "Outcome analytics",
                  d: "Measure total volume, pending load, completed work, and response progress.",
                },
              ].map((x) => (
                  <li key={x.t} className="flex gap-3 items-start">
                    <span className="mt-0.5 h-6 w-6 rounded-lg bg-gradient-to-br from-[oklch(0.64_0.19_258)] to-[oklch(0.72_0.17_162)] flex items-center justify-center shrink-0 shadow-glow">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </span>
                    <div>
                      <div className="font-semibold text-sm tracking-tight text-white">{x.t}</div>
                      <div className="text-sm text-white/65 mt-0.5">{x.d}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <Link
                to="/ngo"
                className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-elevated bg-gradient-to-br from-[oklch(0.64_0.19_258)] to-[oklch(0.55_0.21_272)] hover:opacity-95 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <Building2 className="h-4 w-4" /> Open Command Center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ============== TRUST + METRICS ============== */}
      <section id="trust" className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-24">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground mb-4">
            <ShieldCheck className="h-3.5 w-3.5 text-[oklch(0.64_0.19_258)]" />
            Built for trust, speed, and accountability
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">
            Relief operations need{" "}
            <span className="text-gradient-brand">systems people can trust.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg">
            Designed for transparent coordination between citizens, NGOs, and field volunteers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-6">
          {[
            {
              icon: ShieldCheck,
              tag: "Trust",
              title: "Verified roles",
              desc: "Clear role-based portals keep citizens, NGOs, and volunteers aligned around the same request status.",
              g: "from-[oklch(0.64_0.19_258)] to-[oklch(0.55_0.21_272)]",
              tint: "oklch(0.64 0.19 258)",
            },
            {
              icon: Cpu,
              tag: "Visibility",
              title: "Operational visibility",
              desc: "Live analytics help teams track pending load, assigned work, and completion progress in one view.",
              g: "from-[oklch(0.72_0.17_162)] to-[oklch(0.6_0.15_195)]",
              tint: "oklch(0.72 0.17 162)",
            },
            {
              icon: Lock,
              tag: "Reliability",
              title: "Traceable outcomes",
              desc: "Every request moves through a clear lifecycle from Raised to Closed, reducing ambiguity in handoffs.",
              g: "from-[oklch(0.74_0.19_50)] to-[oklch(0.65_0.21_38)]",
              tint: "oklch(0.74 0.19 50)",
            },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: EASE }}
                className="group relative rounded-3xl glass p-7 lg:p-8 hover:-translate-y-1.5 hover:shadow-elevated transition-all overflow-hidden"
              >
                <div
                  className="absolute -top-16 -right-16 h-44 w-44 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition"
                  style={{ background: c.tint }}
                />
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${c.g} flex items-center justify-center shadow-soft`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span
                      className="text-[10px] font-bold tracking-widest uppercase"
                      style={{ color: c.tint }}
                    >
                      {c.tag}
                    </span>
                  </div>
                  <div className="font-semibold text-lg tracking-tight">{c.title}</div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
                  <div className="mt-6 flex items-center text-xs font-semibold gap-1 opacity-70 group-hover:opacity-100 transition" style={{ color: c.tint }}>
                    Learn more <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust stats row */}
        <motion.div
          {...fadeUp}
          className="mt-10 rounded-3xl glass p-6 lg:p-7 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:divide-x divide-border"
        >
          {[
            { v: 98, suffix: "%", label: "Success rate", color: "oklch(0.72 0.17 162)" },
            { v: 2847, suffix: "+", label: "Volunteers verified", color: "oklch(0.64 0.19 258)" },
            { v: 14, suffix: "", label: "Cities live", color: "oklch(0.74 0.19 50)" },
          ].map((s) => (
            <div key={s.label} className="text-center sm:px-4">
              <div
                className="text-3xl lg:text-4xl font-semibold tracking-tight tabular-nums"
                style={{ color: s.color }}
              >
                <Counter to={s.v} suffix={s.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ============== FINAL CTA ============== */}
      <section className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-20">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-[2rem] p-10 lg:p-20 text-center text-white"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.32 0.12 268), oklch(0.42 0.18 270) 50%, oklch(0.55 0.18 200))",
          }}
        >
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-[oklch(0.78_0.18_55/0.4)] blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-[oklch(0.7_0.16_160/0.4)] blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl sm:text-6xl font-semibold tracking-tight max-w-3xl mx-auto leading-[1.05]">
              Ready to coordinate relief{" "}
              <span className="bg-gradient-to-r from-white to-[oklch(0.85_0.14_70)] bg-clip-text text-transparent">
                with confidence?
              </span>
            </h2>
            <p className="mt-5 text-white/80 max-w-xl mx-auto text-base sm:text-lg">
              Launch the workflow for citizens, coordinators, and volunteers in minutes.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/citizen"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-[oklch(0.22_0.06_265)] hover:bg-white/90 transition shadow-elevated hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <Siren className="h-4 w-4" /> Request Help Now
              </Link>
              <Link
                to="/volunteer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <HeartHandshake className="h-4 w-4" /> Start Volunteering
              </Link>
              <Link
                to="/ngo"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 transition hover:-translate-y-0.5 active:scale-[0.97]"
              >
                <Building2 className="h-4 w-4" /> Open Command Center
              </Link>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md gradient-brand flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            © {new Date().getFullYear()} SahyogX · Built for accountable relief coordination
          </div>
          <div className="flex items-center gap-5">
            <a className="hover:text-foreground transition" href="#">
              Privacy
            </a>
            <a className="hover:text-foreground transition" href="#">
              Terms
            </a>
            <a className="hover:text-foreground transition" href="#">
              Contact
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
