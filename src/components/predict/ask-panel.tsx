import { useMutation } from "@tanstack/react-query";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { IconTile, Panel, Pill } from "@/components/predict/primitives";
import { Button } from "@/components/ui/button";
import { askPredict360 } from "@/lib/assistant.functions";
import type { AnalysisReport } from "@/lib/analysis";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
  report?: AnalysisReport;
  error?: boolean;
};

const SUGGESTIONS = [
  "Why did sales drop in March?",
  "What is the forecast for the next 3 months?",
  "Which factors drive sales the most?",
  "Any anomalies I should know about?",
];

function Evidence({ report }: { report: AnalysisReport }) {
  const focus = report.focusMonth;
  if (!focus) return null;
  return (
    <div className="mt-3 rounded-2xl border border-border bg-card/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone={focus.momChangePct < 0 ? "warning" : "success"}>
          {focus.label}: {focus.momChangePct > 0 ? "+" : ""}
          {focus.momChangePct}% vs {focus.previousLabel}
        </Pill>
        <Pill tone="muted">${focus.sales}M</Pill>
        {focus.isAnomaly && <Pill tone="warning">Anomaly (z {focus.z})</Pill>}
      </div>
      <ul className="mt-3 space-y-2">
        {focus.drivers.slice(0, 4).map((d) => (
          <li key={d.key} className="text-[12.5px]">
            <div className="flex items-center justify-between gap-3 text-foreground">
              <span>{d.label}</span>
              <span className="tabular-nums text-muted-foreground">
                {d.changePct > 0 ? "+" : ""}
                {d.changePct}% · {d.sharePct}% of move
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{ width: `${d.sharePct}%`, background: "var(--tone-blue)" }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11.5px] text-muted-foreground">
        Computed from {report.dataset.name} · {report.dataset.rows} monthly rows ·{" "}
        {report.dataset.period}
      </p>
    </div>
  );
}

export function AskPanel({ className, height = 420 }: { className?: string; height?: number }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const ask = useMutation({
    mutationFn: (question: string) =>
      askPredict360({
        data: {
          question,
          history: messages
            .filter((m) => !m.error)
            .slice(-6)
            .map((m) => ({ role: m.role, content: m.content })),
        },
      }),
    onSuccess: (res) =>
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: res.answer || "I could not produce an answer for that question.",
          report: res.report,
        },
      ]),
    onError: (error: Error) =>
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error.message, error: true },
      ]),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, ask.isPending]);

  const send = (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || ask.isPending) return;
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setValue("");
    ask.mutate(trimmed);
  };

  return (
    <Panel large className={cn("flex flex-col overflow-hidden", className)}>
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <IconTile icon={Sparkles} tone="lavender" className="size-9 rounded-[10px]" />
        <h2 className="text-[15px] font-semibold text-foreground">Ask Predict360</h2>
        <Pill tone="indigo">Live analysis</Pill>
      </div>

      <div
        ref={scrollRef}
        className="soft-scroll flex-1 space-y-5 overflow-y-auto px-6 py-6"
        style={{ minHeight: height }}
      >
        {messages.length === 0 && (
          <div className="space-y-4">
            <div className="ai-veil max-w-xl rounded-2xl rounded-bl-lg px-4 py-3.5 text-[13.5px] text-foreground">
              Ask me anything about <span className="font-semibold">sales_2026_q3.csv</span>. I run
              the analysis on your data and answer with the actual numbers.
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <Button key={s} size="sm" variant="secondary" onClick={() => send(s)}>
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <p className="max-w-md rounded-2xl rounded-br-lg bg-secondary px-4 py-2.5 text-[13.5px] text-foreground">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="max-w-2xl">
              <div
                className={cn(
                  "rounded-2xl rounded-bl-lg px-4 py-3.5",
                  m.error ? "border border-border bg-secondary" : "ai-veil",
                )}
              >
                <div className="prose-p:my-1.5 space-y-2 text-[13.5px] leading-relaxed text-foreground [&_li]:my-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                </div>
                {m.report && <Evidence report={m.report} />}
              </div>
            </div>
          ),
        )}

        {ask.isPending && (
          <div className="ai-veil flex max-w-xs items-center gap-2.5 rounded-2xl rounded-bl-lg px-4 py-3 text-[13px] text-muted-foreground">
            <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
            Running the analysis…
          </div>
        )}
      </div>

      <form
        className="flex items-center gap-3 border-t border-border px-6 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          send(value);
        }}
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask anything about your data…"
          aria-label="Ask Predict360"
          className="h-10 flex-1 rounded-full border border-border bg-card px-4 text-[13.5px] text-foreground placeholder:text-muted-foreground/80 focus-visible:border-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          aria-label="Send"
          disabled={ask.isPending || !value.trim()}
        >
          <Send strokeWidth={1.75} />
        </Button>
      </form>
    </Panel>
  );
}
