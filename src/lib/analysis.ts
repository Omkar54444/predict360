import {
  DRIVERS,
  datasetMeta,
  monthlyMetrics,
  type DriverKey,
  type MonthlyRow,
} from "./predict-metrics";

const MONTH_LOOKUP: Record<string, number> = {
  jan: 1,
  january: 1,
  feb: 2,
  february: 2,
  mar: 3,
  march: 3,
  apr: 4,
  april: 4,
  may: 5,
  jun: 6,
  june: 6,
  jul: 7,
  july: 7,
  aug: 8,
  august: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  nov: 11,
  november: 11,
  dec: 12,
  december: 12,
};

export const round = (n: number, digits = 2) => Number(n.toFixed(digits));

const pctChange = (current: number, previous: number) =>
  previous === 0 ? 0 : round(((current - previous) / previous) * 100, 1);

function pearson(a: number[], b: number[]) {
  const n = Math.min(a.length, b.length);
  const meanA = a.reduce((s, v) => s + v, 0) / n;
  const meanB = b.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let da = 0;
  let db = 0;
  for (let i = 0; i < n; i += 1) {
    const x = a[i]! - meanA;
    const y = b[i]! - meanB;
    num += x * y;
    da += x * x;
    db += y * y;
  }
  const den = Math.sqrt(da * db);
  return den === 0 ? 0 : round(num / den, 3);
}

const seriesOf = (key: DriverKey | "sales") => monthlyMetrics.map((r) => r[key] as number);

/** Pearson correlation of every driver with the target, strongest first. */
export function driverCorrelations() {
  const sales = seriesOf("sales");
  return DRIVERS.map((d) => ({
    key: d.key,
    label: d.label,
    unit: d.unit,
    r: pearson(seriesOf(d.key), sales),
  })).sort((x, y) => Math.abs(y.r) - Math.abs(x.r));
}

/** Month-over-month anomalies in the target, scored with a z-score on the change. */
export function anomalyScan(threshold = 1.8) {
  const changes = monthlyMetrics.slice(1).map((row, i) => ({
    row,
    prev: monthlyMetrics[i]!,
    change: pctChange(row.sales, monthlyMetrics[i]!.sales),
  }));
  const values = changes.map((c) => c.change);
  const mean = values.reduce((s, v) => s + v, 0) / values.length;
  const sd = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length) || 1;
  return changes
    .map((c) => ({
      month: c.row.month,
      label: c.row.label,
      sales: c.row.sales,
      changePct: c.change,
      z: round((c.change - mean) / sd, 2),
    }))
    .filter((c) => Math.abs(c.z) >= threshold)
    .sort((a, b) => Math.abs(b.z) - Math.abs(a.z));
}

/** Ordinary least squares on the target over time, projected forward. */
export function trendForecast(periods = 3) {
  const y = seriesOf("sales");
  const n = y.length;
  const meanX = (n - 1) / 2;
  const meanY = y.reduce((s, v) => s + v, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i += 1) {
    num += (i - meanX) * (y[i]! - meanY);
    den += (i - meanX) ** 2;
  }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  const fitted = y.map((_, i) => intercept + slope * i);
  const ssRes = y.reduce((s, v, i) => s + (v - fitted[i]!) ** 2, 0);
  const ssTot = y.reduce((s, v) => s + (v - meanY) ** 2, 0);
  const rmse = Math.sqrt(ssRes / n);

  const last = monthlyMetrics[n - 1]!;
  const [lastYear, lastMonth] = last.month.split("-").map(Number) as [number, number];
  const points = Array.from({ length: periods }, (_, k) => {
    const idx = n + k;
    const value = intercept + slope * idx;
    const date = new Date(Date.UTC(lastYear, lastMonth - 1 + k + 1, 1));
    const label = date.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
    return {
      label,
      predicted: round(value),
      low: round(value - 1.96 * rmse),
      high: round(value + 1.96 * rmse),
    };
  });

  return {
    slopePerMonth: round(slope, 3),
    r2: round(ssTot === 0 ? 0 : 1 - ssRes / ssTot, 3),
    rmse: round(rmse, 3),
    points,
  };
}

export type DriverAttribution = {
  key: DriverKey;
  label: string;
  unit: string;
  value: number;
  previous: number;
  changePct: number;
  correlation: number;
  sharePct: number;
};

export type MonthExplanation = {
  month: string;
  label: string;
  sales: number;
  previousLabel: string;
  previousSales: number;
  momChangePct: number;
  yoyChangePct: number | null;
  direction: "increase" | "decrease" | "flat";
  isAnomaly: boolean;
  z: number | null;
  drivers: DriverAttribution[];
  otherMovements: DriverAttribution[];
};

/** Decompose a single month's move in the target against its drivers. */
export function explainMonth(monthKey: string): MonthExplanation | null {
  const index = monthlyMetrics.findIndex((r) => r.month === monthKey);
  if (index <= 0) return null;
  const row = monthlyMetrics[index]!;
  const prev = monthlyMetrics[index - 1]!;
  const yoy = monthlyMetrics[index - 12];
  const momChangePct = pctChange(row.sales, prev.sales);
  const correlations = driverCorrelations();

  const scored = DRIVERS.map((d) => {
    const corr = correlations.find((c) => c.key === d.key)!.r;
    const changePct = pctChange(row[d.key] as number, prev[d.key] as number);
    return {
      key: d.key,
      label: d.label,
      unit: d.unit,
      value: row[d.key] as number,
      previous: prev[d.key] as number,
      changePct,
      correlation: corr,
      effect: corr * changePct,
    };
  });

  const sign = Math.sign(momChangePct) || 1;
  const explaining = scored.filter((s) => Math.sign(s.effect) === sign && s.changePct !== 0);
  const totalEffect = explaining.reduce((s, v) => s + Math.abs(v.effect), 0) || 1;

  const drivers: DriverAttribution[] = explaining
    .map(({ effect, ...rest }) => ({
      ...rest,
      sharePct: round((Math.abs(effect) / totalEffect) * 100, 1),
    }))
    .sort((a, b) => b.sharePct - a.sharePct);

  const otherMovements: DriverAttribution[] = scored
    .filter((s) => !drivers.some((d) => d.key === s.key))
    .map(({ effect: _effect, ...rest }) => ({ ...rest, sharePct: 0 }))
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));

  const anomaly = anomalyScan().find((a) => a.month === monthKey);

  return {
    month: row.month,
    label: row.label,
    sales: row.sales,
    previousLabel: prev.label,
    previousSales: prev.sales,
    momChangePct,
    yoyChangePct: yoy ? pctChange(row.sales, yoy.sales) : null,
    direction: momChangePct > 0.5 ? "increase" : momChangePct < -0.5 ? "decrease" : "flat",
    isAnomaly: Boolean(anomaly),
    z: anomaly?.z ?? null,
    drivers,
    otherMovements,
  };
}

/** Resolve a month reference inside free text, e.g. "March" or "March 2025". */
export function resolveMonthFromText(text: string): MonthlyRow | null {
  const lower = text.toLowerCase();
  const match = lower.match(
    /(jan|january|feb|february|mar|march|apr|april|may|jun|june|jul|july|aug|august|sep|sept|september|oct|october|nov|november|dec|december)\.?\s*(\d{4})?/,
  );
  if (!match) return null;
  const monthNum = MONTH_LOOKUP[match[1]!];
  if (!monthNum) return null;
  const year = match[2];
  const candidates = monthlyMetrics.filter((r) => {
    const [y, m] = r.month.split("-");
    return Number(m) === monthNum && (!year || y === year);
  });
  return candidates[candidates.length - 1] ?? null;
}

export function metricSummary() {
  const latest = monthlyMetrics[monthlyMetrics.length - 1]!;
  const prev = monthlyMetrics[monthlyMetrics.length - 2]!;
  const yoy = monthlyMetrics[monthlyMetrics.length - 13];
  const salesValues = seriesOf("sales");
  return {
    latestMonth: latest.label,
    latestSales: latest.sales,
    momChangePct: pctChange(latest.sales, prev.sales),
    yoyChangePct: yoy ? pctChange(latest.sales, yoy.sales) : null,
    best: monthlyMetrics.reduce((a, b) => (b.sales > a.sales ? b : a)).label,
    worst: monthlyMetrics.reduce((a, b) => (b.sales < a.sales ? b : a)).label,
    average: round(salesValues.reduce((s, v) => s + v, 0) / salesValues.length),
  };
}

export type AnalysisReport = ReturnType<typeof runAnalysis>;

/** Deterministic analysis pass. Everything the assistant answers with comes from here. */
export function runAnalysis(question: string) {
  const focusRow = resolveMonthFromText(question);
  const focus = focusRow ? explainMonth(focusRow.month) : null;
  const anomalies = anomalyScan();
  const fallbackFocus =
    focus ?? (anomalies[0] ? explainMonth(anomalies[0].month) : null) ?? null;

  return {
    dataset: datasetMeta,
    summary: metricSummary(),
    focusMonth: fallbackFocus,
    focusRequested: Boolean(focusRow),
    correlations: driverCorrelations(),
    anomalies,
    forecast: trendForecast(3),
    series: monthlyMetrics.map((r) => ({ label: r.label, sales: r.sales })),
  };
}
