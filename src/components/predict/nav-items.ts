import {
  Activity,
  BarChart3,
  Database,
  FileText,
  FlaskConical,
  History,
  LayoutDashboard,
  Lightbulb,
  LineChart,
  Map,
  Sparkles,
  Upload,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export type NavPath =
  | "/dashboard"
  | "/assistant"
  | "/upload"
  | "/datasets"
  | "/analysis-lab"
  | "/predictions"
  | "/forecasting"
  | "/anomaly-detection"
  | "/recommendations"
  | "/what-if"
  | "/scenario-planner"
  | "/reports"
  | "/history";

export type NavItem = { to: NavPath; label: string; icon: LucideIcon };
export type NavGroup = { label: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/upload", label: "Upload Data", icon: Upload },
      { to: "/datasets", label: "My Datasets", icon: Database },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { to: "/assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/analysis-lab", label: "Analysis Lab", icon: FlaskConical },
      { to: "/predictions", label: "Predictions", icon: Wand2 },
      { to: "/forecasting", label: "Forecasting", icon: LineChart },
      { to: "/anomaly-detection", label: "Anomaly Detection", icon: Activity },
      { to: "/recommendations", label: "Recommendations", icon: Lightbulb },
    ],
  },
  {
    label: "Decisions",
    items: [
      { to: "/what-if", label: "What-If Simulator", icon: BarChart3 },
      { to: "/scenario-planner", label: "Scenario Planner", icon: Map },
      { to: "/reports", label: "Reports", icon: FileText },
      { to: "/history", label: "History", icon: History },
    ],
  },
];
