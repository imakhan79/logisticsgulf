import { type InputHTMLAttributes, forwardRef } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export const DatePicker = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative">
      <input
        ref={ref}
        type="date"
        className={cn(
          "w-full rounded-lg border border-border-subtle bg-surface-raised px-3.5 py-2.5 ps-9 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20",
          className,
        )}
        {...props}
      />
      <Calendar className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
    </div>
  ),
);
DatePicker.displayName = "DatePicker";
