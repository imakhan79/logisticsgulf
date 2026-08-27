import { cn } from "@/lib/utils";

export type TimelineStep = {
  label: string;
  timestamp?: string;
  description?: string;
};

export function Timeline({ steps, activeIndex }: { steps: TimelineStep[]; activeIndex?: number }) {
  return (
    <ol className="relative ms-3 space-y-6 border-s-2 border-border-subtle ps-6">
      {steps.map((step, i) => {
        const done = activeIndex === undefined || i <= activeIndex;
        return (
          <li key={i} className="relative">
            <span
              className={cn(
                "absolute -start-[1.94rem] flex h-4 w-4 items-center justify-center rounded-full border-2",
                done ? "border-teal-500 bg-teal-500" : "border-border-subtle bg-surface-raised",
              )}
            />
            <div className="flex items-baseline justify-between gap-3">
              <span className={cn("text-sm font-medium", !done && "text-foreground-muted")}>{step.label}</span>
              {step.timestamp && <span className="text-xs text-foreground-muted">{step.timestamp}</span>}
            </div>
            {step.description && <p className="mt-0.5 text-xs text-foreground-muted">{step.description}</p>}
          </li>
        );
      })}
    </ol>
  );
}
