import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Panel, PanelHead, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export const Route = createFileRoute("/_shell/what-if")({
  head: () => ({
    meta: [
      { title: "What-If Simulator — Predict360" },
      {
        name: "description",
        content:
          "Change marketing spend, traffic and price to see how your predicted outcome moves.",
      },
      { property: "og:title", content: "What-If Simulator — Predict360" },
      {
        property: "og:description",
        content: "Explore how different decisions could change your outcome.",
      },
    ],
  }),
  component: WhatIfPage,
});

type Lever = {
  key: string;
  label: string;
  baseline: number;
  min: number;
  max: number;
  step: number;
  prefix: string;
  weight: number;
};

const levers: Lever[] = [
  { key: "spend", label: "Marketing Spend", baseline: 50000, min: 20000, max: 120000, step: 1000, prefix: "₹", weight: 0.34 },
  { key: "traffic", label: "Website Traffic", baseline: 10000, min: 4000, max: 30000, step: 500, prefix: "", weight: 0.26 },
  { key: "price", label: "Price", baseline: 500, min: 300, max: 800, step: 10, prefix: "₹", weight: -0.19 },
];

const BASELINE_SALES = 5.2;
const SCENARIO_DEFAULTS: Record<string, number> = { spend: 70000, traffic: 12000, price: 480 };

const format = (lever: Lever, value: number) =>
  `${lever.prefix}${value.toLocaleString("en-IN")}`;

function WhatIfPage() {
  const [values, setValues] = useState<Record<string, number>>({ ...SCENARIO_DEFAULTS });

  const read = (lever: Lever) => values[lever.key] ?? lever.baseline;

  const uplift = levers.reduce((total, lever) => {
    const delta = (read(lever) - lever.baseline) / lever.baseline;
    return total + delta * lever.weight;
  }, 0);

  const scenarioSales = BASELINE_SALES * (1 + uplift);
  const change = (scenarioSales / BASELINE_SALES - 1) * 100;

  return (
    <div className="space-y-5">
      <PageIntro
        title="What-If Simulator"
        subtitle="Explore how different decisions could change your outcome."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-6">
          <PanelHead
            title="Baseline"
            subtitle="Your current values."
            action={<Pill>Actual</Pill>}
          />
          <ul className="mt-5 space-y-4">
            {levers.map((lever) => (
              <li
                key={lever.key}
                className="flex items-center justify-between rounded-xl border border-border px-4 py-3.5"
              >
                <span className="text-[13.5px] text-muted-foreground">{lever.label}</span>
                <span className="text-[15px] font-semibold text-foreground">
                  {format(lever, lever.baseline)}
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="p-6">
          <PanelHead
            title="Scenario"
            subtitle="Move a slider or type a value."
            action={<Pill tone="indigo">Simulated</Pill>}
          />
          <ul className="mt-5 space-y-5">
            {levers.map((lever) => (
              <li key={lever.key}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13.5px] text-muted-foreground">{lever.label}</span>
                  <span className="relative">
                    {lever.prefix && (
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
                        {lever.prefix}
                      </span>
                    )}
                    <Input
                      inputMode="numeric"
                      value={read(lever)}
                      onChange={(e) => {
                        const next = Number(e.target.value.replace(/[^0-9]/g, ""));
                        setValues((prev) => ({
                          ...prev,
                          [lever.key]: Number.isFinite(next) && next > 0 ? next : lever.baseline,
                        }));
                      }}
                      className={`h-9 w-28 text-right text-[13.5px] font-semibold ${lever.prefix ? "pl-7" : ""}`}
                    />
                  </span>
                </div>
                <Slider
                  className="mt-3"
                  min={lever.min}
                  max={lever.max}
                  step={lever.step}
                  value={[Math.min(Math.max(read(lever), lever.min), lever.max)]}
                  onValueChange={(next) =>
                    setValues((prev) => ({ ...prev, [lever.key]: next[0] ?? lever.baseline }))
                  }
                />
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel large className="ai-veil p-6">
        <PanelHead title="Predicted Sales" subtitle="Random Forest • 91% confidence" />
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <div>
            <p className="text-[12.5px] text-muted-foreground">Baseline</p>
            <p className="mt-1 text-[26px] font-extrabold text-foreground">
              ₹{BASELINE_SALES.toFixed(1)}L
            </p>
          </div>
          <div>
            <p className="text-[12.5px] text-muted-foreground">Scenario</p>
            <p className="mt-1 text-[26px] font-extrabold text-foreground">
              ₹{scenarioSales.toFixed(1)}L
            </p>
          </div>
          <div>
            <p className="text-[12.5px] text-muted-foreground">Change</p>
            <p
              className={`mt-1 text-[26px] font-extrabold ${change >= 0 ? "text-success" : "text-destructive"}`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </p>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap gap-2">
          <Button>Apply Scenario</Button>
          <Button variant="secondary" onClick={() => setValues({ ...SCENARIO_DEFAULTS })}>
            Reset
          </Button>
        </div>
      </Panel>
    </div>
  );
}
