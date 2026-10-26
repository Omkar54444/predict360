import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye } from "lucide-react";

import { Panel, PanelHead, PageIntro, StatusDot } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { recentAnalyses } from "@/lib/predict-data";

export const Route = createFileRoute("/_shell/history")({
  head: () => ({
    meta: [
      { title: "History — Predict360" },
      {
        name: "description",
        content: "A full log of every analysis run in Predict360, with model, status and date.",
      },
      { property: "og:title", content: "History — Predict360" },
      { property: "og:description", content: "Every run you've made, in one place." },
    ],
  }),
  component: HistoryPage,
});

const rows = [
  ...recentAnalyses,
  {
    dataset: "sales_2026_q2.csv",
    analysis: "Forecasting",
    model: "Random Forest",
    created: "2 weeks ago",
    status: "Completed",
  },
  {
    dataset: "store_footfall.csv",
    analysis: "Regression",
    model: "Linear Regression",
    created: "3 weeks ago",
    status: "Failed",
  },
];

function HistoryPage() {
  return (
    <div>
      <PageIntro title="History" subtitle="Every analysis you've run, newest first." />

      <Panel large className="overflow-hidden">
        <div className="p-6">
          <PanelHead
            title={`${rows.length} runs`}
            subtitle="Across all datasets."
            action={
              <Button variant="secondary" size="sm">
                All time
              </Button>
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[13.5px]">
            <thead>
              <tr className="border-y border-border bg-secondary/40 text-left text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-6 py-3 font-semibold">Dataset</th>
                <th className="px-6 py-3 font-semibold">Analysis</th>
                <th className="px-6 py-3 font-semibold">Model</th>
                <th className="px-6 py-3 font-semibold">Created</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.dataset + row.created} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-4 font-medium text-foreground">{row.dataset}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.analysis}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.model}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.created}</td>
                  <td className="px-6 py-4">
                    <StatusDot status={row.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="View">
                        <Eye strokeWidth={1.75} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Download">
                        <Download strokeWidth={1.75} />
                      </Button>
                    </div>
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
