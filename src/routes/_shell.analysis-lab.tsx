import { createFileRoute } from "@tanstack/react-router";
import { Activity, ArrowRight, LineChart, Sparkles, Target } from "lucide-react";
import { useState } from "react";

import { IconTile, Panel, PanelHead, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/analysis-lab")({
  head: () => ({
    meta: [
      { title: "Analysis Lab — Predict360" },
      {
        name: "description",
        content:
          "Configure a dataset, analysis type, features and model in five clear steps, then run it.",
      },
      { property: "og:title", content: "Analysis Lab — Predict360" },
      { property: "og:description", content: "Five calm steps from dataset to results." },
    ],
  }),
  component: AnalysisLab,
});

const steps = ["Dataset", "Analysis", "Features", "Model", "Results"];

const analysisTypes = [
  { name: "Regression", icon: LineChart, tone: "blue", copy: "Predict a continuous value." },
  { name: "Classification", icon: Target, tone: "indigo", copy: "Predict a category or class." },
  { name: "Forecasting", icon: Sparkles, tone: "lavender", copy: "Project values over time." },
  { name: "Anomaly Detection", icon: Activity, tone: "warning", copy: "Find unusual records." },
] as const;

const features = [
  "Marketing spend",
  "Website traffic",
  "Unit price",
  "Season index",
  "Store count",
  "Discount rate",
];

const modelOptions = ["Linear Regression", "Decision Tree", "Random Forest", "Gradient Boosting"];

function AnalysisLab() {
  const [step, setStep] = useState(1);
  const [analysis, setAnalysis] = useState("Forecasting");
  const [model, setModel] = useState("Random Forest");
  const [selected, setSelected] = useState<string[]>(features.slice(0, 4));

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((f) => f !== name) : [...prev, name],
    );

  return (
    <div className="space-y-6">
      <PageIntro
        title="Analysis Lab"
        subtitle="Set up your analysis step by step, then run it."
        action={
          <Button onClick={() => setStep(5)}>
            Run Analysis <ArrowRight />
          </Button>
        }
      />

      <Panel large className="p-6">
        <ol className="no-scrollbar flex items-center gap-3 overflow-x-auto">
          {steps.map((label, i) => {
            const index = i + 1;
            const active = index === step;
            const done = index < step;
            return (
              <li key={label} className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => setStep(index)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] transition-colors duration-150",
                    active
                      ? "bg-lavender-soft font-semibold text-foreground"
                      : "font-medium text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "text-[11.5px] font-bold tabular-nums",
                      active ? "text-indigo" : done ? "text-success" : "text-muted-foreground/70",
                    )}
                  >
                    0{index}
                  </span>
                  {label}
                </button>
                {i < steps.length - 1 && (
                  <span className="h-px w-6 shrink-0 bg-border" aria-hidden />
                )}
              </li>
            );
          })}
        </ol>
      </Panel>

      {step === 1 && (
        <Panel className="rise p-6">
          <PanelHead title="Choose a dataset" subtitle="Pick the data this analysis will use." />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {["sales_2026_q3.csv", "marketing_spend.xlsx", "customer_churn.csv", "product_returns.csv"].map(
              (name, i) => (
                <button
                  key={name}
                  onClick={() => setStep(2)}
                  className={cn(
                    "rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
                    i === 0 ? "border-indigo/35 bg-indigo-soft/60" : "border-border hover:bg-secondary/60",
                  )}
                >
                  <p className="text-[13.5px] font-semibold text-foreground">{name}</p>
                  <p className="mt-1 text-[12.5px] text-muted-foreground">
                    {i === 0 ? "5,240 rows • 18 columns" : "Ready to analyse"}
                  </p>
                </button>
              ),
            )}
          </div>
        </Panel>
      )}

      {step === 2 && (
        <Panel className="rise p-6">
          <PanelHead title="Analysis type" subtitle="What question are you answering?" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {analysisTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setAnalysis(type.name)}
                className={cn(
                  "flex gap-3.5 rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
                  analysis === type.name
                    ? "border-indigo/35 bg-indigo-soft/60"
                    : "border-border hover:bg-secondary/60",
                )}
              >
                <IconTile icon={type.icon} tone={type.tone} className="size-9 rounded-[10px]" />
                <span>
                  <span className="block text-[13.5px] font-semibold text-foreground">
                    {type.name}
                  </span>
                  <span className="mt-0.5 block text-[12.5px] text-muted-foreground">
                    {type.copy}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 3 && (
        <Panel className="rise p-6">
          <PanelHead
            title="Features"
            subtitle="Select the columns the model should learn from."
            action={<Pill tone="indigo">{selected.length} selected</Pill>}
          />
          <div className="mt-5 flex flex-wrap gap-2">
            {features.map((feature) => (
              <button
                key={feature}
                onClick={() => toggle(feature)}
                className={cn(
                  "rounded-full border px-4 py-2 text-[13px] font-medium transition-colors duration-150",
                  selected.includes(feature)
                    ? "border-indigo/35 bg-indigo-soft text-indigo"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {feature}
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 4 && (
        <Panel className="rise p-6">
          <PanelHead title="Model" subtitle="Or let Predict360 pick the best one for you." />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {modelOptions.map((name) => (
              <button
                key={name}
                onClick={() => setModel(name)}
                className={cn(
                  "flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-150 hover:-translate-y-0.5",
                  model === name
                    ? "border-indigo/35 bg-indigo-soft/60"
                    : "border-border hover:bg-secondary/60",
                )}
              >
                <span className="text-[13.5px] font-semibold text-foreground">{name}</span>
                {name === "Random Forest" && <Pill tone="success">Recommended</Pill>}
              </button>
            ))}
          </div>
        </Panel>
      )}

      {step === 5 && (
        <div className="rise grid gap-5 lg:grid-cols-3">
          <Panel className="p-6 lg:col-span-2">
            <PanelHead
              title="Results"
              subtitle={`${analysis} • ${model}`}
              action={<Pill tone="success">Completed</Pill>}
            />
            <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "R² Score", value: "0.91" },
                { label: "RMSE", value: "0.24" },
                { label: "MAE", value: "0.19" },
                { label: "Runtime", value: "6.4s" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border p-4">
                  <dt className="text-[12px] text-muted-foreground">{item.label}</dt>
                  <dd className="mt-1 text-[19px] font-bold text-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button>View Predictions</Button>
              <Button variant="secondary">Download Report</Button>
            </div>
          </Panel>
          <Panel className="p-6">
            <PanelHead title="Configuration" subtitle="What this run used." />
            <ul className="mt-5 space-y-3 text-[13px]">
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Dataset</span>
                <span className="font-medium text-foreground">sales_2026_q3.csv</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Analysis</span>
                <span className="font-medium text-foreground">{analysis}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium text-foreground">{model}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-muted-foreground">Features</span>
                <span className="font-medium text-foreground">{selected.length}</span>
              </li>
            </ul>
          </Panel>
        </div>
      )}

      <div className="flex justify-between gap-3">
        <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        <Button variant="secondary" disabled={step === 5} onClick={() => setStep((s) => s + 1)}>
          Next step <ArrowRight />
        </Button>
      </div>
    </div>
  );
}
