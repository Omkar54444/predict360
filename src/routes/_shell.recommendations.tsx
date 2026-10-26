import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, TrendingUp, PackageCheck, Megaphone } from "lucide-react";

import { IconTile, Panel, PageIntro, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_shell/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations — Predict360" },
      {
        name: "description",
        content: "Actions suggested by your models, each with a reason, expected impact and confidence.",
      },
      { property: "og:title", content: "Recommendations — Predict360" },
      { property: "og:description", content: "What to do next, and why." },
    ],
  }),
  component: RecommendationsPage,
});

const items = [
  {
    title: "Increase inventory for Product B",
    icon: PackageCheck,
    tone: "mint",
    reason: "Demand forecast indicates increased demand.",
    impact: "+18%",
    confidence: "87%",
  },
  {
    title: "Shift 15% of ad spend to the top channel",
    icon: Megaphone,
    tone: "indigo",
    reason: "Marketing spend is the strongest driver of predicted revenue.",
    impact: "+9%",
    confidence: "82%",
  },
  {
    title: "Review pricing on Product A",
    icon: TrendingUp,
    tone: "warning",
    reason: "Price sensitivity explains most of the March decline.",
    impact: "+6%",
    confidence: "74%",
  },
] as const;

function RecommendationsPage() {
  return (
    <div>
      <PageIntro
        title="Recommendations"
        subtitle="Suggested next steps based on your latest analysis."
        action={
          <Pill tone="indigo">
            <Lightbulb className="size-3" strokeWidth={2} /> 3 open
          </Pill>
        }
      />

      <div className="space-y-4">
        {items.map((item) => (
          <Panel key={item.title} className="panel-hover p-6">
            <div className="flex flex-wrap items-start gap-4">
              <IconTile icon={item.icon} tone={item.tone} />
              <div className="min-w-[240px] flex-1">
                <h2 className="text-[15.5px] font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1.5 text-[13.5px] text-muted-foreground">
                  <span className="font-medium text-foreground">Reason: </span>
                  {item.reason}
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-[12px] text-muted-foreground">Expected impact</p>
                  <p className="mt-0.5 text-[17px] font-bold text-success">{item.impact}</p>
                </div>
                <div>
                  <p className="text-[12px] text-muted-foreground">Confidence</p>
                  <p className="mt-0.5 text-[17px] font-bold text-foreground">{item.confidence}</p>
                </div>
              </div>
              <div className="flex w-full gap-2 sm:w-auto">
                <Button variant="secondary" size="sm">
                  View Analysis
                </Button>
                <Button size="sm">Accept</Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
