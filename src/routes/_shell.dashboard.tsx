import { Link, createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Database,
  Eye,
  Gauge,
  IndianRupee,
  LineChart,
  Lightbulb,
  Send,
  Sparkles,
  ShieldCheck,
  Upload,
  Download,
} from "lucide-react";

import { AskPanel } from "@/components/predict/ask-panel";
import { CompositionDonut, ForecastChart } from "@/components/predict/charts";
import {
  IconTile,
  Panel,
  PanelHead,
  PageIntro,
  Pill,
  StatCard,
  StatusDot,
} from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { models, recentAnalyses } from "@/lib/predict-data";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Predict360" },
      {
        name: "description",
        content:
          "Predict360 dashboard: data quality, model performance and a three-month sales forecast at a glance.",
      },
      { property: "og:title", content: "Dashboard — Predict360" },
      {
        property: "og:description",
        content: "Turn your data into powerful insights and make smarter decisions.",
      },
    ],
  }),
  component: Dashboard,
});

const quickActions = [
  { label: "Upload Data", icon: Upload, tone: "blue", to: "/upload" },
  { label: "Run Analysis", icon: Sparkles, tone: "indigo", to: "/analysis-lab" },
  { label: "Make Predictions", icon: Gauge, tone: "lavender", to: "/predictions" },
  { label: "View Forecast", icon: LineChart, tone: "blue", to: "/forecasting" },
  { label: "Check Anomalies", icon: Activity, tone: "warning", to: "/anomaly-detection" },
  { label: "Get Recommendations", icon: Lightbulb, tone: "mint", to: "/recommendations" },
] as const;

const insights = [
  { text: "Sales expected to grow by 12% next quarter.", icon: LineChart, tone: "success" },
  { text: "Unusual drop detected in Product A revenue.", icon: Activity, tone: "warning" },
  { text: "High demand expected for Product B in October.", icon: Sparkles, tone: "indigo" },
] as const;

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageIntro
        title="Good Morning, Isha!"
        subtitle="Turn your data into powerful insights and make smarter decisions."
        action={
          <Button asChild>
            <Link to="/analysis-lab">
              Run Analysis <ArrowRight />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Database}
          tone="blue"
          label="Total Records"
          value="5,240"
          hint="+12% vs last upload"
          hintTone="up"
        />
        <StatCard
          icon={ShieldCheck}
          tone="mint"
          label="Data Quality"
          value="92/100"
          hint="Good"
          hintTone="muted"
        />
        <StatCard
          icon={Sparkles}
          tone="indigo"
          label="Best Model"
          value="Random Forest"
          hint="R² 0.91"
          hintTone="muted"
        />
        <StatCard
          icon={IndianRupee}
          tone="lavender"
          label="Predicted Value"
          value="₹5,20,000"
          hint="+8.4% expected"
          hintTone="up"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Panel large className="p-6">
          <PanelHead
            title="Sales Forecast"
            subtitle="Next 3 months forecast based on your data."
            action={
              <Button variant="secondary" size="sm">
                Last 6 Months
              </Button>
            }
          />
          <div className="mt-5 flex flex-wrap items-center gap-5 text-[12.5px] text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-blue" /> Actual
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded-full bg-indigo opacity-70" /> Predicted
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-5 rounded-sm bg-indigo/12" /> Confidence
            </span>
          </div>
          <div className="mt-2">
            <ForecastChart />
          </div>
        </Panel>

        <Panel className="p-6">
          <PanelHead title="Quick Actions" subtitle="Jump straight into your workflow." />
          <div className="mt-5 grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.to}
                className="group flex flex-col gap-3 rounded-xl border border-border p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:bg-secondary/60"
              >
                <IconTile icon={action.icon} tone={action.tone} className="size-9 rounded-[10px]" />
                <span className="text-[12.5px] font-semibold leading-snug text-foreground">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Panel className="p-6">
          <PanelHead title="Data Overview" subtitle="Records by category." />
          <div className="mt-6">
            <CompositionDonut />
          </div>
        </Panel>

        <Panel className="p-6">
          <PanelHead title="Top Insights" subtitle="What your data is telling you." />
          <ul className="mt-5 space-y-4">
            {insights.map((insight) => (
              <li key={insight.text} className="flex gap-3">
                <IconTile icon={insight.icon} tone={insight.tone} className="size-9 rounded-[10px]" />
                <p className="pt-1.5 text-[13.5px] leading-snug text-foreground">{insight.text}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-6">
          <PanelHead title="Model Performance" subtitle="Compared on your latest run." />
          <table className="mt-5 w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground">
                <th className="pb-3 font-semibold">Model</th>
                <th className="pb-3 text-right font-semibold">R²</th>
                <th className="pb-3 text-right font-semibold">RMSE</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.name} className="border-t border-border/70">
                  <td className="py-3 pr-2">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      {model.name}
                      {model.best && <Pill tone="success">Best</Pill>}
                    </span>
                  </td>
                  <td className="py-3 text-right font-semibold text-foreground">{model.r2}</td>
                  <td className="py-3 text-right text-muted-foreground">{model.rmse}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>

      <Panel large className="overflow-hidden">
        <div className="p-6">
          <PanelHead
            title="Recent Analyses"
            subtitle="Your latest runs across datasets."
            action={
              <Button variant="ghost" size="sm" asChild>
                <Link to="/history">View all</Link>
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
              {recentAnalyses.map((row) => (
                <tr key={row.dataset} className="border-b border-border/60 last:border-0">
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

      <AskPanel height={340} />
    </div>
  );
}

