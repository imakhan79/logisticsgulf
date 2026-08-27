import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-navy-900 text-white shadow-sm hover:bg-navy-800 hover:shadow-md active:scale-[0.98]",
        accent: "bg-teal-500 text-white shadow-sm hover:bg-teal-400 hover:shadow-md active:scale-[0.98]",
        outline: "border border-border-subtle bg-transparent hover:bg-surface active:scale-[0.98]",
        ghost: "hover:bg-surface active:scale-[0.98]",
        destructive: "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = "Button";
