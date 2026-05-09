import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-label font-semibold uppercase tracking-[0.1em] transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
  {
    variants: {
      variant: {
        primary:
          "border border-border bg-foreground text-bg hover:border-cyber hover:shadow-[0_0_16px_rgba(100,149,237,0.15)]",
        hot:
          "border border-mint/40 bg-mint text-bg hover:border-mint hover:shadow-[0_0_14px_rgba(52,211,153,0.25)]",
        outline:
          "border border-border bg-transparent text-foreground hover:border-cyber hover:text-cyber-bright",
        ghost:
          "border border-transparent text-muted-strong hover:border-border hover:bg-surface-2 hover:text-foreground",
        link: "border-transparent text-cyber underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-[10px]",
        md: "h-10 px-4 text-[11px]",
        lg: "h-11 px-5 text-xs",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
