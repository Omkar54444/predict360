import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid size-8 place-items-center rounded-xl bg-primary">
        <span className="size-3 rounded-full border-[2.5px] border-primary-foreground/85" />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-mint" />
      </span>
      <span className="text-[15px] font-extrabold tracking-tight text-foreground">
        Predict<span className="text-blue">360</span>
      </span>
    </span>
  );
}
