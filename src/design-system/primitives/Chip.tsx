import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "@/lib/icons";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  [
    "inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full border px-4",
    "font-ui text-sm font-semibold leading-5 whitespace-nowrap",
    "transition-[background-color,border-color,color,box-shadow,opacity] outline-none select-none",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        navigation: "",
        filter: "",
        removable: "",
      },
      selected: {
        true: "shadow-sm",
        false: "",
      },
      pending: {
        true:
          "cursor-wait shadow-sm opacity-80",
        false: "",
      },
      dimmed: {
        true: "opacity-40",
        false: "",
      },
    },
    defaultVariants: {
      variant: "navigation",
      selected: false,
      pending: false,
      dimmed: false,
    },
    compoundVariants: [
      {
        variant: "navigation",
        selected: false,
        pending: false,
        className:
          "border-border-strong bg-background text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground",
      },
      {
        variant: "navigation",
        selected: true,
        className:
          "border-[var(--state-selected-stroke)] bg-[var(--state-selected-fill)] text-foreground",
      },
      {
        variant: "navigation",
        pending: true,
        className:
          "border-[var(--state-selected-stroke)] bg-background text-foreground",
      },
      {
        variant: "filter",
        selected: false,
        pending: false,
        className:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted hover:text-foreground",
      },
      {
        variant: "filter",
        selected: true,
        className:
          "border-[var(--state-selected-stroke)] bg-[var(--state-selected-fill)] text-foreground",
      },
      {
        variant: "filter",
        pending: true,
        className:
          "border-[var(--state-selected-stroke)] bg-background text-foreground",
      },
      {
        variant: "removable",
        selected: false,
        pending: false,
        className: "border-border bg-card text-foreground",
      },
      {
        variant: "removable",
        selected: true,
        className:
          "border-[var(--state-selected-stroke)] bg-[var(--state-selected-fill)] text-foreground",
      },
      {
        variant: "removable",
        pending: true,
        className:
          "border-[var(--state-selected-stroke)] bg-background text-foreground",
      },
    ],
  },
);

const chipRemoveButtonVariants = cva(
  [
    "inline-flex size-5 shrink-0 items-center justify-center rounded-full",
    "text-muted-foreground transition-colors outline-none",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:text-[hsl(var(--ink-subtle))]",
    "hover:bg-background hover:text-foreground",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ].join(" "),
);

type ChipVariant = VariantProps<typeof chipVariants>["variant"];
type ChipVisualStateProps = VariantProps<typeof chipVariants>;

interface BaseChipProps extends ChipVisualStateProps {
  variant?: ChipVariant;
}

export interface ChipProps
  extends React.ComponentPropsWithoutRef<"span">,
    BaseChipProps {}

export interface ChipButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    BaseChipProps {}

export interface ChipRemoveButtonProps
  extends React.ComponentPropsWithoutRef<"button"> {}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  (
    {
      className,
      variant = "navigation",
      selected = false,
      pending = false,
      dimmed = false,
      ...props
    },
    ref,
  ) => (
    <span
      ref={ref}
      data-slot="chip"
      data-variant={variant}
      data-selected={selected ? "true" : "false"}
      data-pending={pending ? "true" : "false"}
      className={cn(chipVariants({ variant, selected, pending, dimmed }), className)}
      {...props}
    />
  ),
);

Chip.displayName = "Chip";

const ChipButton = React.forwardRef<HTMLButtonElement, ChipButtonProps>(
  (
    {
      type = "button",
      className,
      variant = "navigation",
      selected = false,
      pending = false,
      dimmed = false,
      disabled,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      data-slot="chip"
      data-variant={variant}
      data-selected={selected ? "true" : "false"}
      data-pending={pending ? "true" : "false"}
      aria-pressed={selected || undefined}
      aria-busy={pending || undefined}
      disabled={disabled}
      className={cn(chipVariants({ variant, selected, pending, dimmed }), className)}
      {...props}
    />
  ),
);

ChipButton.displayName = "ChipButton";

const ChipRemoveButton = React.forwardRef<
  HTMLButtonElement,
  ChipRemoveButtonProps
>(({ type = "button", className, children, ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    data-slot="chip-remove"
    className={cn(chipRemoveButtonVariants(), className)}
    {...props}
  >
    {children ?? <X aria-hidden="true" />}
  </button>
));

ChipRemoveButton.displayName = "ChipRemoveButton";

export {
  Chip,
  ChipButton,
  ChipRemoveButton,
  chipRemoveButtonVariants,
  chipVariants,
};
