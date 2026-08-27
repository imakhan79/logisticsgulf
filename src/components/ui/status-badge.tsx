import { cn } from "@/lib/utils";

const TONES = {
  neutral: "bg-surface text-foreground-muted border-border-subtle",
  info: "bg-ocean-500/10 text-ocean-600 border-ocean-500/20",
  success: "bg-teal-500/10 text-teal-500 border-teal-500/20",
  warning: "bg-gold-500/10 text-gold-500 border-gold-500/30",
  danger: "bg-red-500/10 text-red-600 border-red-500/20",
} as const;

const STATUS_TONE: Record<string, keyof typeof TONES> = {
  draft: "neutral",
  pending: "neutral",
  pending_approval: "warning",
  approved: "info",
  accepted: "info",
  converted: "success",
  confirmed: "info",
  in_transit: "info",
  delivered: "success",
  paid: "success",
  active: "success",
  unpaid: "warning",
  rejected: "danger",
  cancelled: "danger",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = TONES[STATUS_TONE[status] ?? "neutral"];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        tone,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
