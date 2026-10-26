import { createFileRoute } from "@tanstack/react-router";
import { Activity, AlertTriangle, CheckCircle2, Database, Eye } from "lucide-react";

import { AnomalyChart } from "@/components/predict/anomaly-chart";
import { Panel, PanelHead, PageIntro, Pill, StatCard } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { anomalies } from "@/lib/predict-data";

export const Route = createFileRoute("/_shell/anomaly-detection")({
  head: () => ({
    meta: [
      { title: "Anomaly Detection — Predict360" },
      {
        name: "description",
        content: "Spot unusual records in your dataset with severity, timing and deviation.",
      },
      { property: "og:title", content: "Anomaly Detection — Predict360" },
      { property: "og:description", content: "Find what doesn't belong in your data." },
    ],
  }),
  component: AnomalyPage,
});

function AnomalyPage() {
  return (
    <div className="space-y-5">
      <PageIntro
        title="Anomaly Detection"
        subtitle="Unusual records found in sales_2026_q3.csv."
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Database} tone="blue" label="Total Records" value="5,240" hint="Scanned" />
        <StatCard icon={Activity} tone="indigo" label="Anomalies" value="42" hint="0.8% of records" />
        <StatCard
          icon={AlertTriangle}
          tone="warning"
          label="Critical"
          value="6"
          hint="Needs review"
          hintTone="down"
        />
        <StatCard icon={CheckCircle2} tone="mint" label="Normal" value="5,198" hint="Within range" />
      </div>

      <Panel large className="p-6">
        <PanelHead
          title="Anomaly timeline"
          subtitle="Anomaly score by day for the last month."
          action={
            <Button variant="secondary" size="sm">
              Last 30 Days
            </Button>
          }
        />
        <div className="mt-4">
          <AnomalyChart />
        </div>
      </Panel>

      <Panel large className="overflow-hidden">
        <div className="p-6">
          <PanelHead title="Detected anomalies" subtitle="Sorted by severity." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-[13.5px]">
            <thead>
              <tr className="border-y border-border bg-secondary/40 text-left text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Field</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Severity</th>
                <th className="px-6 py-3 font-semibold">Deviation</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map((row) => (
                <tr key={row.id} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-4 font-medium text-foreground">{row.id}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.field}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.date}</td>
                  <td className="px-6 py-4">
                    <Pill tone={row.severity === "Critical" ? "warning" : "muted"}>
                      {row.severity}
                    </Pill>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{row.deviation}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" aria-label="Inspect">
                      <Eye strokeWidth={1.75} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
