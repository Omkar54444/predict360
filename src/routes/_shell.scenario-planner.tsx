import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";

import { Panel, PanelHead, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/scenario-planner")({
  head: () => ({
    meta: [
      { title: "Scenario Planner — Predict360" },
      {
        name: "description",
        content: "Compare saved scenarios side by side and choose the plan with the best outcome.",
      },
      { property: "og:title", content: "Scenario Planner — Predict360" },
      { property: "og:description", content: "Compare plans before you commit to one." },
    ],
  }),
  component: ScenarioPlanner,
});

const scenarios = [
  {
    name: "Conservative",
    sales: "₹5.4L",
    change: "+3.8%",
    risk: "Low",
    notes: "Hold spend, small price cut.",
    best: false,
  },
  {
    name: "Balanced growth",
    sales: "₹6.1L",
    change: "+17.3%",
    risk: "Moderate",
    notes: "Raise spend 40%, price down 4%.",
    best: true,
  },
  {
    name: "Aggressive",
    sales: "₹6.6L",
    change: "+26.9%",
    risk: "High",
    notes: "Double spend, widen discounts.",
    best: false,
  },
];

function ScenarioPlanner() {
  return (
    <div className="space-y-5">
      <PageIntro
        title="Scenario Planner"
        subtitle="Compare the plans you've saved and pick a direction."
        action={
          <Button asChild>
            <Link to="/what-if">
              <Plus /> New Scenario
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        {scenarios.map((scenario) => (
          <Panel
            key={scenario.name}
            className={cn("panel-hover p-6", scenario.best && "border-indigo/30")}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-semibold text-foreground">{scenario.name}</h2>
              {scenario.best && <Pill tone="success">Recommended</Pill>}
            </div>
            <p className="mt-4 text-[12.5px] text-muted-foreground">Predicted sales</p>
            <p className="mt-1 text-[26px] font-extrabold text-foreground">{scenario.sales}</p>
            <p className="mt-1 text-[13px] font-semibold text-success">{scenario.change}</p>

            <dl className="mt-5 space-y-3 border-t border-border pt-4 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Risk</dt>
                <dd className="font-medium text-foreground">{scenario.risk}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Levers</dt>
                <dd className="max-w-[58%] text-right font-medium text-foreground">
                  {scenario.notes}
                </dd>
              </div>
            </dl>

            <Button variant="secondary" size="sm" className="mt-5 w-full">
              Open scenario <ArrowRight />
            </Button>
          </Panel>
        ))}
      </div>

      <Panel large className="p-6">
        <PanelHead
          title="How they compare"
          subtitle="Same dataset and model across all three scenarios."
        />
        <div className="mt-5 space-y-4">
          {scenarios.map((scenario) => (
            <div key={scenario.name}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-foreground">{scenario.name}</span>
                <span className="font-semibold text-muted-foreground">{scenario.sales}</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={cn("h-full rounded-full", scenario.best ? "bg-indigo" : "bg-blue")}
                  style={{ width: `${(parseFloat(scenario.sales.slice(1)) / 7) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
