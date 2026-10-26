import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Panel, PanelHead, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { featureImportance } from "@/lib/predict-data";

export const Route = createFileRoute("/_shell/predictions")({
  head: () => ({
    meta: [
      { title: "Predictions — Predict360" },
      {
        name: "description",
        content:
          "Enter your input variables and get a prediction with confidence and the features behind it.",
      },
      { property: "og:title", content: "Predictions — Predict360" },
      { property: "og:description", content: "A prediction you can explain, not just a number." },
    ],
  }),
  component: PredictionsPage,
});

const inputs = [
  { label: "Marketing Spend", value: "50000", prefix: "₹" },
  { label: "Website Traffic", value: "10000", prefix: "" },
  { label: "Unit Price", value: "500", prefix: "₹" },
  { label: "Store Count", value: "12", prefix: "" },
];

function PredictionsPage() {
  const [values, setValues] = useState(inputs.map((i) => i.value));

  return (
    <div>
      <PageIntro
        title="Predictions"
        subtitle="Set your inputs and see the predicted outcome."
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <Panel className="p-6">
          <PanelHead title="Input variables" subtitle="Adjust any value to re-predict." />
          <div className="mt-5 space-y-4">
            {inputs.map((input, i) => (
              <label key={input.label} className="block">
                <span className="text-[12.5px] font-medium text-muted-foreground">
                  {input.label}
                </span>
                <span className="relative mt-1.5 block">
                  {input.prefix && (
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-muted-foreground">
                      {input.prefix}
                    </span>
                  )}
                  <Input
                    inputMode="numeric"
                    value={values[i]}
                    onChange={(e) =>
                      setValues((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))
                    }
                    className={input.prefix ? "pl-7" : undefined}
                  />
                </span>
              </label>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button>
              Predict <ArrowRight />
            </Button>
            <Button variant="secondary" onClick={() => setValues(inputs.map((i) => i.value))}>
              Reset
            </Button>
          </div>
        </Panel>

        <div className="space-y-5">
          <Panel className="ai-veil p-6">
            <PanelHead
              title="Prediction result"
              subtitle="Random Forest • R² 0.91"
              action={<Pill tone="indigo">Live</Pill>}
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-[12.5px] text-muted-foreground">Predicted Sales</p>
                <p className="mt-1 text-[30px] font-extrabold leading-none text-foreground">₹6.8L</p>
              </div>
              <div>
                <p className="text-[12.5px] text-muted-foreground">Expected Growth</p>
                <p className="mt-1 text-[22px] font-bold text-success">+12%</p>
              </div>
              <div>
                <p className="text-[12.5px] text-muted-foreground">Confidence</p>
                <p className="mt-1 text-[22px] font-bold text-foreground">91%</p>
              </div>
            </div>
          </Panel>

          <Panel className="p-6">
            <PanelHead
              title="Why this prediction?"
              subtitle="The most influential features in this result."
            />
            <ul className="mt-5 space-y-3.5">
              {featureImportance.map((item) => (
                <li key={item.feature}>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-foreground">{item.feature}</span>
                    <span className="font-semibold text-muted-foreground">
                      {Math.round(item.weight * 100)}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-indigo"
                      style={{ width: `${item.weight * 100 * 2.6}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
