import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const readOnlyTokenVariants = cva(
  [
    "inline-flex shrink-0 items-center rounded-full border border-border bg-muted px-3 py-1.5",
    "font-ui text-small font-medium text-foreground whitespace-nowrap",
  ].join(" "),
  {
    variants: {
      variant: {
        contentMetadata: "",
      },
    },
    defaultVariants: {
      variant: "contentMetadata",
    },
  },
);

export interface ReadOnlyTokenProps
  extends React.ComponentPropsWithoutRef<"span">,
    VariantProps<typeof readOnlyTokenVariants> {}

const ReadOnlyToken = React.forwardRef<HTMLSpanElement, ReadOnlyTokenProps>(
  ({ className, variant, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(readOnlyTokenVariants({ variant }), className)}
      {...props}
    />
  ),
);

ReadOnlyToken.displayName = "ReadOnlyToken";

export { ReadOnlyToken, readOnlyTokenVariants };
