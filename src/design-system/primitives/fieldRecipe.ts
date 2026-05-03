export type FieldControlSize = "sm" | "md" | "lg" | "field";
export type FieldControlDensity = "comfortable" | "compact";

export const fieldInputBaseClassName = [
  "min-w-0 w-full border border-input bg-shell shadow-none outline-none",
  "font-ui text-foreground placeholder:text-muted-foreground",
  "transition-[background-color,border-color,color,box-shadow] duration-150",
  "hover:border-border hover:bg-inset",
  "focus:border-ring focus:bg-inset focus:ring-2 focus:ring-ring/18 focus:ring-offset-0",
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-inset disabled:text-muted-foreground",
  "read-only:border-border read-only:bg-inset read-only:text-foreground read-only:cursor-default",
].join(" ");

export const fieldControlSizeClassNames: Record<
  FieldControlDensity,
  Record<FieldControlSize, string>
> = {
  comfortable: {
    sm: "h-8 rounded-[var(--radius-md)] px-3 text-sm",
    md: "h-10 rounded-[var(--radius-lg)] px-4 text-sm",
    lg: "h-12 rounded-[var(--radius-lg)] px-4 text-sm",
    field: "h-14 rounded-[var(--radius-lg)] px-4 text-sm",
  },
  compact: {
    sm: "h-8 rounded-[var(--radius-sm)] px-3 text-sm",
    md: "h-10 rounded-[var(--radius-sm)] px-4 text-sm",
    lg: "h-12 rounded-[var(--radius-sm)] px-4 text-sm",
    field: "h-14 rounded-[var(--radius-sm)] px-4 text-sm",
  },
};

export const selectControlSizeClassNames: Record<
  FieldControlDensity,
  Record<FieldControlSize, string>
> = {
  comfortable: {
    sm: "h-8 pr-9 text-sm",
    md: "h-10 pr-10 text-sm",
    lg: "h-12 pr-10 text-sm",
    field: "h-14 pr-10 text-sm",
  },
  compact: {
    sm: "h-8 pr-9 text-sm",
    md: "h-10 pr-10 text-sm",
    lg: "h-12 pr-10 text-sm",
    field: "h-14 pr-10 text-sm",
  },
};

export function resolveFieldControlSize(
  size: FieldControlSize | undefined,
  density: FieldControlDensity = "comfortable",
): FieldControlSize {
  if (size) {
    return size;
  }

  return density === "compact" ? "sm" : "field";
}

export function getFieldControlSizeClassName(
  size: FieldControlSize | undefined,
  density: FieldControlDensity = "comfortable",
) {
  return fieldControlSizeClassNames[density][resolveFieldControlSize(size, density)];
}

export function resolveSelectControlSize(
  size: FieldControlSize | undefined,
): FieldControlSize {
  return size ?? "md";
}

export function getSelectControlSizeClassName(
  size: FieldControlSize | undefined,
  density: FieldControlDensity = "comfortable",
) {
  return selectControlSizeClassNames[density][resolveSelectControlSize(size)];
}

export const fieldStartAdornmentWidthClassNames: Record<FieldControlSize, string> = {
  sm: "w-9",
  md: "w-10",
  lg: "w-11",
  field: "w-11",
};

export const fieldEndAdornmentWidthClassNames: Record<FieldControlSize, string> = {
  sm: "w-9",
  md: "w-10",
  lg: "w-11",
  field: "w-11",
};

export const fieldStartAdornmentClassName =
  "absolute inset-y-0 left-0 flex w-11 items-center justify-center";

export const fieldEndAdornmentClassName =
  "absolute inset-y-0 right-0 flex w-11 items-center justify-center";
