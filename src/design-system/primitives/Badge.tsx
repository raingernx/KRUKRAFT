import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-badge font-medium whitespace-nowrap transition-colors [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        success:
          "border-success-500/25 bg-accent text-success-700",
        warning:
          "border-warning-500/35 bg-inset text-warning-700",
        neutral: "bg-muted text-muted-foreground",
        info: "border-primary/25 bg-accent text-primary",
        featured:
          "border-accent-yellow/40 bg-accent-yellow-soft text-accent-yellow",
        destructive: "bg-red-50 text-red-600",
        outline: "border border-border-strong bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant = "neutral",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
