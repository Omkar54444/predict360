import { Link, createFileRoute } from "@tanstack/react-router";
import { Eye, Plus, Trash2 } from "lucide-react";

import { Panel, PanelHead, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/datasets")({
  head: () => ({
    meta: [
      { title: "My Datasets — Predict360" },
      {
        name: "description",
        content: "All datasets you have uploaded to Predict360, with rows, columns and quality.",
      },
      { property: "og:title", content: "My Datasets — Predict360" },
      { property: "og:description", content: "Manage the datasets powering your predictions." },
    ],
  }),
  component: DatasetsPage,
});

const datasets = [
  { name: "sales_2026_q3.csv", rows: "5,240", cols: 18, quality: 92, updated: "2 hours ago" },
  { name: "marketing_spend.xlsx", rows: "1,180", cols: 11, quality: 88, updated: "Yesterday" },
  { name: "customer_churn.csv", rows: "3,410", cols: 24, quality: 79, updated: "3 days ago" },
  { name: "product_returns.csv", rows: "720", cols: 9, quality: 95, updated: "1 week ago" },
];

function DatasetsPage() {
  return (
    <div>
      <PageIntro
        title="My Datasets"
        subtitle="Everything you've uploaded, ready to analyse."
        action={
          <Button asChild>
            <Link to="/upload">
              <Plus /> Upload Data
            </Link>
          </Button>
        }
      />

      <Panel large className="overflow-hidden">
        <div className="p-6">
          <PanelHead title="4 datasets" subtitle="Sorted by last activity." />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-[13.5px]">
            <thead>
              <tr className="border-y border-border bg-secondary/40 text-left text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="px-6 py-3 font-semibold">Dataset</th>
                <th className="px-6 py-3 font-semibold">Rows</th>
                <th className="px-6 py-3 font-semibold">Columns</th>
                <th className="px-6 py-3 font-semibold">Quality</th>
                <th className="px-6 py-3 font-semibold">Updated</th>
                <th className="px-6 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map((row) => (
                <tr key={row.name} className="border-b border-border/60 last:border-0">
                  <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.rows}</td>
                  <td className="px-6 py-4 text-muted-foreground">{row.cols}</td>
                  <td className="px-6 py-4">
                    <Pill tone={row.quality >= 90 ? "success" : row.quality >= 85 ? "indigo" : "warning"}>
                      {row.quality}/100
                    </Pill>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{row.updated}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="View">
                        <Eye strokeWidth={1.75} />
                      </Button>
                      <Button variant="ghost" size="icon" aria-label="Delete">
                        <Trash2 strokeWidth={1.75} />
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
