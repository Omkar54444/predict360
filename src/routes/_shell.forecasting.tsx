import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";

import { ForecastChart } from "@/components/predict/charts";
import { Panel, PanelHead, PageIntro } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/forecasting")({
  head: () => ({
    meta: [
      { title: "Forecasting — Predict360" },
      {
        name: "description",
        content:
          "Project historical data forward with a confidence range you can read at a glance.",
      },
      { property: "og:title", content: "Forecasting — Predict360" },
      { property: "og:description", content: "Historical trend, forecast and confidence range." },
    ],
  }),
  component: ForecastingPage,
});

const controls = [
  { label: "Dataset", value: "sales_2026_q3.csv" },
  { label: "Target", value: "Monthly revenue" },
  { label: "Forecast Period", value: "3 months" },
  { label: "Model", value: "Random Forest" },
];

function ForecastingPage() {
  return (
    <div className="space-y-5">
      <PageIntro
        title="Forecasting"
        subtitle="See where your numbers are heading, and how sure the model is."
        action={
          <Button variant="secondary">
            <Download /> Export
          </Button>
        }
      />

      <Panel className="p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {controls.map((control) => (
            <label key={control.label} className="block">
              <span className="text-[12px] font-medium text-muted-foreground">{control.label}</span>
              <select
                defaultValue={control.value}
                className="mt-1.5 h-10 w-full rounded-xl border border-border bg-card px-3 text-[13px] font-medium text-foreground focus-visible:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              >
                <option>{control.value}</option>
              </select>
            </label>
          ))}
        </div>
      </Panel>

      <Panel large className="p-6">
        <PanelHead
          title="Revenue forecast"
          subtitle="Next 3 months, with an 90% confidence range."
        />
        <div className="mt-5 flex flex-wrap items-center gap-5 text-[12.5px] text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-blue" /> Historical
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded-full bg-indigo opacity-70" /> Forecast
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-5 rounded-sm bg-indigo/12" /> Confidence range
          </span>
        </div>
        <div className="mt-2">
          <ForecastChart height={360} />
        </div>
      </Panel>

      <div className="grid gap-5 sm:grid-cols-3">
        {[
          { label: "Forecast total", value: "₹17.7L", hint: "Oct – Dec 2026" },
          { label: "Expected growth", value: "+12.4%", hint: "vs previous quarter" },
          { label: "Model confidence", value: "91%", hint: "Random Forest" },
        ].map((item) => (
          <Panel key={item.label} className="p-5">
            <p className="text-[12.5px] text-muted-foreground">{item.label}</p>
            <p className="mt-1 text-[24px] font-extrabold text-foreground">{item.value}</p>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{item.hint}</p>
          </Panel>
        ))}
      </div>
    </div>
  );
}
