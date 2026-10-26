/**
 * Predict360 working dataset: `sales_2026_q3.csv`
 * Monthly business metrics used by the analysis engine and the AI assistant.
 * Sales, marketing spend and product revenue are in millions of USD.
 */

export type MonthlyRow = {
  month: string; // e.g. "2026-03"
  label: string; // e.g. "Mar 2026"
  sales: number;
  marketingSpend: number;
  webTraffic: number; // sessions, millions
  avgPrice: number;
  promoDays: number;
  productARevenue: number;
  refunds: number; // thousands of USD
  stores: number;
};

const raw: Array<[string, number, number, number, number, number, number, number, number]> = [
  // month, sales, marketingSpend, webTraffic, avgPrice, promoDays, productA, refunds, stores
  ["2025-01", 3.4, 0.44, 0.98, 41.5, 6, 0.95, 58, 120],
  ["2025-02", 3.6, 0.47, 1.02, 41.2, 7, 1.01, 55, 120],
  ["2025-03", 3.5, 0.45, 1.0, 41.8, 5, 0.98, 61, 121],
  ["2025-04", 3.7, 0.49, 1.06, 41.6, 7, 1.04, 57, 122],
  ["2025-05", 3.9, 0.52, 1.11, 41.4, 8, 1.09, 54, 124],
  ["2025-06", 3.8, 0.5, 1.08, 42.0, 6, 1.06, 60, 124],
  ["2025-07", 4.0, 0.54, 1.14, 41.9, 8, 1.12, 56, 126],
  ["2025-08", 4.2, 0.57, 1.19, 42.1, 9, 1.18, 53, 127],
  ["2025-09", 4.3, 0.58, 1.21, 42.3, 8, 1.2, 57, 128],
  ["2025-10", 4.5, 0.61, 1.26, 42.2, 9, 1.26, 55, 130],
  ["2025-11", 4.8, 0.66, 1.34, 41.9, 11, 1.35, 52, 131],
  ["2025-12", 5.0, 0.7, 1.41, 41.6, 12, 1.42, 59, 132],
  ["2026-01", 4.6, 0.63, 1.3, 42.6, 8, 1.31, 62, 132],
  ["2026-02", 4.5, 0.62, 1.28, 42.8, 8, 1.3, 64, 133],
  ["2026-03", 3.6, 0.43, 1.05, 46.1, 2, 1.0, 92, 133],
  ["2026-04", 4.1, 0.55, 1.18, 44.2, 6, 1.16, 71, 134],
  ["2026-05", 4.4, 0.6, 1.25, 43.4, 8, 1.24, 63, 135],
  ["2026-06", 4.2, 0.57, 1.21, 43.6, 6, 1.19, 66, 135],
  ["2026-07", 4.9, 0.67, 1.36, 43.1, 10, 1.38, 58, 137],
  ["2026-08", 5.1, 0.71, 1.42, 43.0, 11, 1.44, 56, 138],
  ["2026-09", 5.2, 0.73, 1.45, 42.9, 11, 1.47, 57, 139],
];

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const monthlyMetrics: MonthlyRow[] = raw.map(
  ([month, sales, marketingSpend, webTraffic, avgPrice, promoDays, productARevenue, refunds, stores]) => {
    const [year, m] = month.split("-");
    return {
      month,
      label: `${MONTH_NAMES[Number(m) - 1]} ${year}`,
      sales,
      marketingSpend,
      webTraffic,
      avgPrice,
      promoDays,
      productARevenue,
      refunds,
      stores,
    };
  },
);

export const DRIVERS = [
  { key: "marketingSpend", label: "Marketing spend", unit: "$M" },
  { key: "webTraffic", label: "Website traffic", unit: "M sessions" },
  { key: "avgPrice", label: "Average unit price", unit: "$" },
  { key: "promoDays", label: "Promotion days", unit: "days" },
  { key: "productARevenue", label: "Product A revenue", unit: "$M" },
  { key: "refunds", label: "Refunds", unit: "$K" },
  { key: "stores", label: "Active stores", unit: "stores" },
] as const;

export type DriverKey = (typeof DRIVERS)[number]["key"];

export const datasetMeta = {
  name: "sales_2026_q3.csv",
  rows: monthlyMetrics.length,
  columns: 9,
  target: "sales",
  granularity: "monthly",
  period: `${monthlyMetrics[0]!.label} – ${monthlyMetrics[monthlyMetrics.length - 1]!.label}`,
  currency: "USD (millions)",
};
