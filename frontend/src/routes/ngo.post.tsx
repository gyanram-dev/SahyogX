import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "../components/portal/PortalLayout";

export const Route = createFileRoute("/ngo/post")({
  head: () => ({ meta: [{ title: "Post Task - NGO" }] }),
  component: () => (
    <>
      <PageHeader title="Post a task" subtitle="Describe the need clearly so the right volunteers can be matched quickly." />
      <Card className="max-w-3xl">
        <div className="mb-5 rounded-xl border border-border/70 bg-background/70 px-4 py-3 text-xs text-muted-foreground shadow-soft">
          Task composer preview. Core request assignment currently happens through the live NGO dashboard.
        </div>
        <div className="grid gap-5">
          <Field label="Task title"><input className={inputCls} placeholder="e.g. Pack hygiene kits for Shelter B" /></Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Category">
              <select className={inputCls}>
                <option>Food & water</option><option>Medical</option><option>Shelter</option>
                <option>Logistics</option><option>Communication</option>
              </select>
            </Field>
            <Field label="Urgency">
              <select className={inputCls}>
                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Location"><input className={inputCls} placeholder="Ward / address" /></Field>
            <Field label="People affected"><input type="number" className={inputCls} placeholder="0" /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Window start"><input type="datetime-local" className={inputCls} /></Field>
            <Field label="Window end"><input type="datetime-local" className={inputCls} /></Field>
          </div>
          <Field label="Required skills"><input className={inputCls} placeholder="e.g. First aid, Driving, Hindi" /></Field>
          <Field label="Description"><textarea rows={4} className={inputCls} placeholder="What needs to happen, who is impacted, and any equipment needed..." /></Field>
          <div className="flex justify-end gap-2 pt-2">
            <button disabled className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground opacity-70">Draft Coming Soon</button>
            <button disabled className="px-4 py-2 rounded-lg gradient-brand text-white text-sm font-medium shadow-soft opacity-70">Publish Coming Soon</button>
          </div>
        </div>
      </Card>
    </>
  ),
});

const inputCls = "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}
