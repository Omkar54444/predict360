import {
  Area,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { dataComposition, forecastSeries } from "@/lib/predict-data";

const axis = {
  stroke: "var(--color-border)",
  tick: { fill: "var(--color-muted-foreground)", fontSize: 12 },
};

function ChartTooltip({
  active,
  payload,
  label,
  unit = "",
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number | string; color?: string; dataKey?: string }>;
  label?: string | number;
  unit?: string;
}) {
  if (!active || !payload?.length) return null;
  const rows = payload.filter((p) => p.dataKey !== "low" && p.dataKey !== "high" && p.value != null);
  if (!rows.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-lift">
      <p className="text-[11.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div className="mt-1.5 space-y-1">
        {rows.map((row) => (
          <p key={row.dataKey} className="flex items-center gap-2 text-[13px] text-foreground">
            <span className="size-1.5 rounded-full" style={{ background: row.color }} />
            <span className="text-muted-foreground">{row.name}</span>
            <span className="ml-auto font-semibold">
              {unit}
              {row.value}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function ForecastChart({ height = 300 }: { height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={forecastSeries} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="var(--color-border)" vertical={false} strokeDasharray="0" />
          <XAxis dataKey="month" {...axis} axisLine={false} tickLine={false} />
          <YAxis
            {...axis}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v: number) => `₹${v}L`}
          />
          <Tooltip content={<ChartTooltip unit="₹" />} />
          <Area
            dataKey="high"
            name="Confidence"
            stroke="none"
            fill="var(--tone-indigo)"
            fillOpacity={0.1}
            isAnimationActive={false}
            stackId="conf"
            baseValue="dataMin"
          />
          <Line
            dataKey="actual"
            name="Actual"
            stroke="var(--tone-blue)"
            strokeWidth={2.4}
            dot={false}
            connectNulls
            animationDuration={700}
          />
          <Line
            dataKey="predicted"
            name="Predicted"
            stroke="var(--tone-indigo)"
            strokeWidth={2.4}
            strokeDasharray="5 5"
            dot={false}
            connectNulls
            animationDuration={700}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompositionDonut() {
  const total = dataComposition.reduce((s, d) => s + d.value, 0);
  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
      <div className="relative h-[176px] w-[176px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataComposition}
              dataKey="value"
              innerRadius={60}
              outerRadius={84}
              paddingAngle={3}
              stroke="none"
              cornerRadius={6}
              animationDuration={700}
            >
              {dataComposition.map((slice) => (
                <Cell key={slice.name} fill={slice.tone} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <p className="text-[20px] font-extrabold text-foreground">{total.toLocaleString()}</p>
          <p className="text-[11.5px] text-muted-foreground">Records</p>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {dataComposition.map((slice) => (
          <li key={slice.name} className="flex items-center gap-2.5 text-[13px]">
            <span className="size-2 rounded-full" style={{ background: slice.tone }} />
            <span className="text-muted-foreground">{slice.name}</span>
            <span className="ml-auto font-semibold text-foreground">
              {Math.round((slice.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
