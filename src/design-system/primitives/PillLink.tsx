import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pillLinkVariants = cva(
  [
    "inline-flex min-h-8 shrink-0 self-start items-center justify-center gap-1 rounded-full px-2.5 py-1 sm:self-auto",
    "font-ui text-small font-medium leading-5 whitespace-nowrap",
    "text-primary transition-[background-color,color,box-shadow] outline-none",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "[&_svg:not([class*='size-'])]:size-3.5 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        sectionHeader: "hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "sectionHeader",
    },
  },
);

export interface PillLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    VariantProps<typeof pillLinkVariants> {}

const PillLink = React.forwardRef<HTMLAnchorElement, PillLinkProps>(
  ({ className, variant, ...props }, ref) => (
    <a ref={ref} className={cn(pillLinkVariants({ variant }), className)} {...props} />
  ),
);

PillLink.displayName = "PillLink";

export { PillLink, pillLinkVariants };
