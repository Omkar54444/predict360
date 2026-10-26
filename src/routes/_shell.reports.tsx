import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Plus } from "lucide-react";

import { IconTile, Panel, PageIntro, PanelHead, StatusDot } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Predict360" },
      {
        name: "description",
        content: "Generate and download shareable reports from your analyses and forecasts.",
      },
      { property: "og:title", content: "Reports — Predict360" },
      { property: "og:description", content: "Share your findings as a clean report." },
    ],
  }),
  component: ReportsPage,
});

const reports = [
  {
    name: "Q3 Sales Forecast",
    dataset: "sales_2026_q3.csv",
    created: "2 hours ago",
    type: "Forecast",
    status: "Completed",
  },
  {
    name: "Marketing Impact Review",
    dataset: "marketing_spend.xlsx",
    created: "Yesterday",
    type: "Regression",
    status: "Completed",
  },
  {
    name: "Churn Risk Summary",
    dataset: "customer_churn.csv",
    created: "3 days ago",
    type: "Classification",
    status: "Running",
  },
  {
    name: "Returns Anomaly Report",
    dataset: "product_returns.csv",
    created: "1 week ago",
    type: "Anomaly",
    status: "Completed",
  },
];

function ReportsPage() {
  return (
    <div>
      <PageIntro
        title="Reports"
        subtitle="Everything you've generated, ready to share."
        action={
          <Button>
            <Plus /> Generate Report
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {reports.map((report) => (
          <Panel key={report.name} className="panel-hover p-6">
            <div className="flex items-start gap-4">
              <IconTile icon={FileText} tone="indigo" />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-[15px] font-semibold text-foreground">
                  {report.name}
                </h2>
                <p className="mt-1 truncate text-[13px] text-muted-foreground">{report.dataset}</p>
              </div>
              <Button variant="ghost" size="icon" aria-label="Download">
                <Download strokeWidth={1.75} />
              </Button>
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-[13px]">
              <div>
                <dt className="text-[12px] text-muted-foreground">Type</dt>
                <dd className="mt-0.5 font-medium text-foreground">{report.type}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-muted-foreground">Created</dt>
                <dd className="mt-0.5 font-medium text-foreground">{report.created}</dd>
              </div>
              <div>
                <dt className="text-[12px] text-muted-foreground">Status</dt>
                <dd className="mt-0.5">
                  <StatusDot status={report.status} />
                </dd>
              </div>
            </dl>
          </Panel>
        ))}
      </div>

      <Panel large className="mt-5 p-6">
        <PanelHead
          title="Scheduled reports"
          subtitle="Nothing scheduled yet — generate one to reuse it monthly."
          action={
            <Button variant="secondary" size="sm">
              Set a schedule
            </Button>
          }
        />
      </Panel>
    </div>
  );
}
