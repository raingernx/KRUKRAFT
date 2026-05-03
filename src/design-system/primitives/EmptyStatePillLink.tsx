import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const emptyStatePillLinkVariants = cva(
  [
    "inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-border bg-background px-4 py-2",
    "font-ui text-sm font-medium text-foreground whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow] outline-none",
    "hover:bg-muted",
    "focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:text-muted-foreground",
  ].join(" "),
  {
    variants: {
      variant: {
        emptyState: "",
      },
    },
    defaultVariants: {
      variant: "emptyState",
    },
  },
);

export interface EmptyStatePillLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VariantProps<typeof emptyStatePillLinkVariants> {}

const EmptyStatePillLink = React.forwardRef<HTMLAnchorElement, EmptyStatePillLinkProps>(
  ({ className, variant, ...props }, ref) => (
    <a
      ref={ref}
      className={cn(emptyStatePillLinkVariants({ variant }), className)}
      {...props}
    />
  ),
);

EmptyStatePillLink.displayName = "EmptyStatePillLink";

export { EmptyStatePillLink, emptyStatePillLinkVariants };
