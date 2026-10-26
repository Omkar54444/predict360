import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
  large,
}: {
  className?: string;
  children: ReactNode;
  large?: boolean;
}) {
  return <section className={cn(large ? "panel-lg" : "panel", className)}>{children}</section>;
}

export function PanelHead({
  title,
  subtitle,
  action,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageIntro({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="rise mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-extrabold text-foreground">{title}</h1>
        <p className="mt-1.5 max-w-xl text-[14px] text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

const tones = {
  blue: "bg-blue-soft text-blue",
  indigo: "bg-indigo-soft text-indigo",
  lavender: "bg-lavender-soft text-lavender",
  mint: "bg-mint-soft text-mint",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
} as const;

export type Tone = keyof typeof tones;

export function IconTile({
  icon: Icon,
  tone = "blue",
  className,
}: {
  icon: LucideIcon;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn("icon-tile", tones[tone], className)}>
      <Icon className="size-[18px]" strokeWidth={1.75} />
    </span>
  );
}

export function StatCard({
  icon,
  tone = "blue",
  label,
  value,
  hint,
  hintTone = "muted",
}: {
  icon: LucideIcon;
  tone?: Tone;
  label: string;
  value: string;
  hint: string;
  hintTone?: "muted" | "up" | "down";
}) {
  return (
    <div className="panel panel-hover p-5">
      <IconTile icon={icon} tone={tone} />
      <p className="mt-4 text-[12.5px] font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-[24px] font-extrabold leading-tight text-foreground">{value}</p>
      <p
        className={cn(
          "mt-1.5 text-[12.5px] font-medium",
          hintTone === "up" && "text-success",
          hintTone === "down" && "text-destructive",
          hintTone === "muted" && "text-muted-foreground",
        )}
      >
        {hint}
      </p>
    </div>
  );
}

export function Pill({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "success" | "warning" | "indigo";
}) {
  const map = {
    muted: "bg-secondary text-muted-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    indigo: "bg-indigo-soft text-indigo",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-semibold",
        map[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatusDot({ status }: { status: string }) {
  const tone =
    status === "Completed"
      ? "bg-success"
      : status === "Running"
        ? "bg-warning"
        : status === "Failed"
          ? "bg-destructive"
          : "bg-muted-foreground";
  return (
    <span className="inline-flex items-center gap-2 text-[13px] font-medium text-foreground">
      <span className={cn("size-1.5 rounded-full", tone)} />
      {status}
    </span>
  );
}
