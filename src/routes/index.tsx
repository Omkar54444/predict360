import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  GraduationCap,
  Landmark,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
} from "lucide-react";

import { Logo } from "@/components/predict/logo";
import { IconTile, Panel } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { ForecastChart } from "@/components/predict/charts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Predict360" },
      {
        name: "description",
        content:
          "Predict360 turns raw data into predictions, explanations, simulations and actionable decision support for teams and students.",
      },
      { property: "og:title", content: "Predict360 — From Data to Smarter Decisions" },
      {
        property: "og:description",
        content:
          "Transform raw data into predictions, explanations, simulations and actionable decision support.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  { title: "Understand", icon: Brain, tone: "blue", copy: "See the shape, quality and gaps of your data instantly." },
  { title: "Predict", icon: Sparkles, tone: "indigo", copy: "Forecast outcomes with models selected for your dataset." },
  { title: "Trust", icon: ShieldCheck, tone: "mint", copy: "Every prediction comes with the reasons behind it." },
  { title: "Decide", icon: Target, tone: "lavender", copy: "Simulate decisions before you commit to them." },
] as const;

const loop = [
  "Data",
  "Understand",
  "Predict",
  "Explain",
  "Validate",
  "Simulate",
  "Recommend",
  "Decide",
];

const useCases = [
  { title: "Business Analytics", icon: Building2, copy: "Revenue, demand and performance forecasting." },
  { title: "Education", icon: GraduationCap, copy: "Learn modelling with guided, explainable workflows." },
  { title: "Retail & E-Commerce", icon: ShoppingBag, copy: "Inventory planning and price sensitivity." },
  { title: "Finance", icon: Landmark, copy: "Risk signals, anomalies and scenario planning." },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1160px] items-center justify-between px-5 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-7 text-[13.5px] font-medium text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#loop">
              How it works
            </a>
            <a className="transition-colors hover:text-foreground" href="#use-cases">
              Use cases
            </a>
          </nav>
          <Button asChild size="sm">
            <Link to="/dashboard">
              Get Started <ArrowRight />
            </Link>
          </Button>
        </div>
      </header>

      <section className="hero-veil">
        <div className="mx-auto max-w-[1160px] px-5 pb-16 pt-20 lg:px-8 lg:pb-24 lg:pt-28">
          <div className="rise mx-auto max-w-2xl text-center">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.18em] text-indigo">
              Predict360
            </p>
            <h1 className="mt-4 text-balance text-[38px] font-extrabold leading-[1.1] text-foreground lg:text-[52px]">
              From Data to Prediction, Insight and Smarter Decisions.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-muted-foreground">
              Transform raw data into predictions, explanations, simulations and actionable decision
              support.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link to="/dashboard">
                  Get Started <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/forecasting">Explore Demo</Link>
              </Button>
            </div>
          </div>

          <Panel large className="mt-16 overflow-hidden p-2 shadow-lift">
            <div className="rounded-[18px] border border-border/70 bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
                <div>
                  <p className="text-[13.5px] font-semibold text-foreground">Sales Forecast</p>
                  <p className="text-[12px] text-muted-foreground">
                    Next 3 months forecast based on your data.
                  </p>
                </div>
                <span className="hidden rounded-full bg-secondary px-3 py-1 text-[11.5px] font-semibold text-muted-foreground sm:block">
                  Last 6 Months
                </span>
              </div>
              <div className="grid gap-6 p-5 lg:grid-cols-[1.6fr_1fr]">
                <ForecastChart height={260} />
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                  {[
                    { label: "Predicted Value", value: "₹5,20,000", hint: "+8.4%" },
                    { label: "Best Model", value: "Random Forest", hint: "R² 0.91" },
                    { label: "Data Quality", value: "92/100", hint: "Good" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-border p-4">
                      <p className="text-[12px] text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-[17px] font-bold text-foreground">{item.value}</p>
                      <p className="mt-0.5 text-[12px] font-medium text-success">{item.hint}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[1160px] px-5 py-20 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="panel panel-hover p-6">
              <IconTile icon={feature.icon} tone={feature.tone} />
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {feature.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="loop" className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1160px] px-5 py-20 lg:px-8">
          <div className="max-w-lg">
            <h2 className="text-[26px] font-extrabold text-foreground">The intelligence loop</h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Eight steps from a raw file to a decision you can defend.
            </p>
          </div>
          <ol className="no-scrollbar mt-10 flex items-center gap-3 overflow-x-auto pb-2">
            {loop.map((step, i) => (
              <li key={step} className="flex shrink-0 items-center gap-3">
                <span className="rounded-full border border-border bg-card px-4 py-2 text-[13px] font-semibold text-foreground">
                  {step}
                </span>
                {i < loop.length - 1 && <ArrowRight className="size-4 text-muted-foreground/60" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="use-cases" className="mx-auto max-w-[1160px] px-5 py-20 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((item) => (
            <div key={item.title} className="panel panel-hover p-6">
              <item.icon className="size-[18px] text-indigo" strokeWidth={1.75} />
              <h3 className="mt-4 text-[15px] font-semibold text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1160px] px-5 pb-24 lg:px-8">
        <Panel large className="hero-veil flex flex-wrap items-center justify-between gap-6 p-10">
          <div>
            <h2 className="text-[24px] font-extrabold text-foreground">
              Ready to see what your data predicts?
            </h2>
            <p className="mt-2 text-[14.5px] text-muted-foreground">
              Upload a dataset and get your first forecast in minutes.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/upload">
              Get Started <ArrowRight />
            </Link>
          </Button>
        </Panel>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-4 px-5 py-8 lg:px-8">
          <Logo />
          <p className="text-[12.5px] text-muted-foreground">
            From Data to Prediction, Insight and Smarter Decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
