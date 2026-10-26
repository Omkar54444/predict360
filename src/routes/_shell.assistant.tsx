import { createFileRoute } from "@tanstack/react-router";

import { AskPanel } from "@/components/predict/ask-panel";
import { PageIntro } from "@/components/predict/primitives";

export const Route = createFileRoute("/_shell/assistant")({
  component: AssistantPage,
  head: () => ({
    meta: [
      { title: "AI Assistant — Predict360" },
      {
        name: "description",
        content:
          "Ask Predict360 questions about your dataset and get answers backed by live statistical analysis, driver attribution and forecasts.",
      },
      { property: "og:title", content: "AI Assistant — Predict360" },
      {
        property: "og:description",
        content: "Data-backed answers about trends, drops, drivers and forecasts in your dataset.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function AssistantPage() {
  return (
    <div>
      <PageIntro
        title="AI Assistant"
        subtitle="Every answer is generated from a fresh analysis pass over your dataset — driver attribution, anomaly scores and trend forecasts included."
      />
      <AskPanel height={520} />
    </div>
  );
}
