import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <ol className="flex items-center">
      {steps.map((step, i) => (
        <li key={step} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                i < activeIndex && "border-teal-500 bg-teal-500 text-white",
                i === activeIndex && "border-teal-500 text-teal-600",
                i > activeIndex && "border-border-subtle text-foreground-muted",
              )}
            >
              {i < activeIndex ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("text-xs font-medium", i > activeIndex && "text-foreground-muted")}>{step}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("mx-2 h-px flex-1", i < activeIndex ? "bg-teal-500" : "bg-border-subtle")} />
          )}
        </li>
      ))}
    </ol>
  );
}
