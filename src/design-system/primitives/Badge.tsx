import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex min-h-6 items-center justify-center gap-1 rounded-full border border-transparent px-2 py-0.5 font-ui font-medium whitespace-nowrap transition-colors [&>svg]:size-3 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        success:
          "border-[var(--support-success-base)] bg-[var(--support-success-soft)] text-[var(--support-success-dust)]",
        warning:
          "border-[var(--support-warning-base)] bg-[var(--support-warning-soft)] text-[var(--support-warning-dust)]",
        neutral: "bg-inset text-muted-foreground",
        info: "border-[var(--support-info-base)] bg-[var(--support-info-soft)] text-[var(--support-info-dust)]",
        featured:
          "border-[var(--accent-sand-dust)] bg-[var(--accent-sand-wash)] text-[var(--accent-sand-base)]",
        destructive:
          "border-[var(--state-danger-stroke)] bg-[var(--state-danger-fill)] text-[var(--state-danger-text)]",
        outline: "border border-border bg-transparent text-foreground",
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
  style,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      style={{
        fontSize: "var(--font-size-badge)",
        lineHeight: "var(--line-height-badge)",
        letterSpacing: "var(--letter-spacing-body)",
        ...style,
      }}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
