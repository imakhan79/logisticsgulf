import { CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  info: { icon: Info, className: "bg-ocean-500/10 text-ocean-600 border-ocean-500/20" },
  success: { icon: CheckCircle2, className: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  warning: { icon: AlertTriangle, className: "bg-gold-500/10 text-gold-600 border-gold-500/30" },
  error: { icon: XCircle, className: "bg-red-500/10 text-red-600 border-red-500/20" },
} as const;

export function Alert({
  variant = "info",
  title,
  children,
  className,
}: {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: variantClass } = VARIANTS[variant];

  return (
    <div className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm", variantClass, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        {title && <div className="font-medium">{title}</div>}
        {children && <div className={title ? "mt-0.5 text-xs opacity-90" : ""}>{children}</div>}
      </div>
    </div>
  );
}
