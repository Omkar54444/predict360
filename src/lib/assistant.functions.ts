import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { runAnalysis, type AnalysisReport } from "./analysis";

const Input = z.object({
  question: z.string().min(1).max(600),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(4000),
      }),
    )
    .max(12)
    .default([]),
});

const INSTRUCTIONS = `You are Predict360's analyst assistant. You answer questions about the user's connected dataset.

Rules:
- Use ONLY the numbers in the ANALYSIS JSON provided in the conversation. Never invent figures.
- Always quote concrete values (%, $M, correlations) and name the months involved.
- When a month's change is asked about, explain it with the driver attribution shares in focusMonth.drivers, largest first.
- Be concise: a one-line answer, then at most 4 short bullets, then one short next-step suggestion.
- Use markdown (bold for figures, "-" bullets). No headings, no tables, no preamble.
- If the analysis JSON has no data for what is asked, say so plainly.`;

export type AssistantAnswer = { answer: string; report: AnalysisReport };

export const askPredict360 = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<AssistantAnswer> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const report = runAnalysis(data.question);

    const input = [
      ...data.history.map((m) => ({
        role: m.role,
        content: [{ type: m.role === "user" ? "input_text" : "output_text", text: m.content }],
      })),
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `ANALYSIS JSON (computed from the dataset just now):\n${JSON.stringify(report)}\n\nQuestion: ${data.question}`,
          },
        ],
      },
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        instructions: INSTRUCTIONS,
        input,
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("Predict360 AI is busy right now. Please retry shortly.");
      if (res.status === 402)
        throw new Error("AI credits are exhausted for this workspace. Add credits to continue.");
      throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let answer = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (event.type === "response.output_text.delta" && event.delta) answer += event.delta;
          if (event.type === "response.completed" && !answer && event.response?.output_text)
            answer = event.response.output_text;
        } catch {
          // ignore keep-alive / partial frames
        }
      }
    }

    return { answer: answer.trim(), report };
  });
