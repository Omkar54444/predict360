import { Bar, BarChart, Cell, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { anomalyTimeline } from "@/lib/predict-data";

function Box({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string | number;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-lift">
      <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        Day {label}
      </p>
      <p className="mt-1 text-[13px] font-semibold text-foreground">
        Anomaly score {payload[0]?.value}
      </p>
    </div>
  );
}

export function AnomalyChart({ height = 300 }: { height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={anomalyTimeline} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={48}
            domain={[0, 1]}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          />
          <Tooltip content={<Box />} cursor={{ fill: "var(--color-secondary)" }} />
          <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={22} animationDuration={700}>
            {anomalyTimeline.map((point) => (
              <Cell
                key={point.day}
                fill={point.score > 0.5 ? "var(--tone-warning)" : "var(--tone-blue)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
