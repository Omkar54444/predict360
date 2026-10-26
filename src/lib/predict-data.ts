export const forecastSeries = [
  { month: "Apr", actual: 4.1, predicted: null as number | null, low: 0, high: 0 },
  { month: "May", actual: 4.4, predicted: null as number | null, low: 0, high: 0 },
  { month: "Jun", actual: 4.2, predicted: null as number | null, low: 0, high: 0 },
  { month: "Jul", actual: 4.9, predicted: null as number | null, low: 0, high: 0 },
  { month: "Aug", actual: 5.1, predicted: null as number | null, low: 0, high: 0 },
  { month: "Sep", actual: 5.2, predicted: 5.2, low: 5.2, high: 5.2 },
  { month: "Oct", actual: null, predicted: 5.5, low: 5.2, high: 5.8 },
  { month: "Nov", actual: null, predicted: 5.9, low: 5.4, high: 6.4 },
  { month: "Dec", actual: null, predicted: 6.3, low: 5.6, high: 7.0 },
];

export const dataComposition = [
  { name: "Sales", value: 2040, tone: "var(--tone-blue)" },
  { name: "Marketing", value: 1180, tone: "var(--tone-indigo)" },
  { name: "Customer", value: 880, tone: "var(--tone-lavender)" },
  { name: "Product", value: 720, tone: "var(--tone-mint)" },
  { name: "Others", value: 420, tone: "var(--tone-warning)" },
];

export const models = [
  { name: "Linear Regression", r2: 0.78, rmse: "0.42", best: false },
  { name: "Decision Tree", r2: 0.84, rmse: "0.36", best: false },
  { name: "Random Forest", r2: 0.91, rmse: "0.24", best: true },
  { name: "Gradient Boosting", r2: 0.89, rmse: "0.27", best: false },
];

export const recentAnalyses = [
  {
    dataset: "sales_2026_q3.csv",
    analysis: "Forecasting",
    model: "Random Forest",
    created: "2 hours ago",
    status: "Completed",
  },
  {
    dataset: "marketing_spend.xlsx",
    analysis: "Regression",
    model: "Gradient Boosting",
    created: "Yesterday",
    status: "Completed",
  },
  {
    dataset: "customer_churn.csv",
    analysis: "Classification",
    model: "Decision Tree",
    created: "3 days ago",
    status: "Running",
  },
  {
    dataset: "product_returns.csv",
    analysis: "Anomaly Detection",
    model: "Isolation Forest",
    created: "5 days ago",
    status: "Completed",
  },
];

export const anomalyTimeline = [
  { day: "01", score: 0.12 },
  { day: "05", score: 0.18 },
  { day: "09", score: 0.14 },
  { day: "13", score: 0.62 },
  { day: "17", score: 0.21 },
  { day: "21", score: 0.16 },
  { day: "25", score: 0.78 },
  { day: "29", score: 0.19 },
];

export const anomalies = [
  { id: "A-1043", field: "Product A revenue", date: "13 Sep 2026", severity: "Critical", deviation: "-23.4%" },
  { id: "A-1052", field: "Website sessions", date: "25 Sep 2026", severity: "Critical", deviation: "-18.1%" },
  { id: "A-1061", field: "Refund count", date: "27 Sep 2026", severity: "Moderate", deviation: "+9.8%" },
  { id: "A-1068", field: "Avg. order value", date: "29 Sep 2026", severity: "Low", deviation: "+4.2%" },
];

export const featureImportance = [
  { feature: "Marketing spend", weight: 0.34 },
  { feature: "Website traffic", weight: 0.26 },
  { feature: "Unit price", weight: 0.19 },
  { feature: "Season index", weight: 0.13 },
  { feature: "Store count", weight: 0.08 },
];
