export const fieldInputBaseClassName = [
  "min-w-0 h-11 w-full rounded-lg border border-input bg-background px-4",
  "font-ui text-sm text-foreground placeholder:text-muted-foreground shadow-none outline-none",
  "transition-[background-color,border-color,color,box-shadow] duration-150",
  "hover:border-border hover:bg-muted/40",
  "focus:border-ring focus:ring-2 focus:ring-ring/18 focus:ring-offset-0",
  "disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
  "read-only:border-border read-only:bg-muted read-only:text-foreground read-only:cursor-default",
].join(" ");

export const fieldStartAdornmentClassName =
  "absolute inset-y-0 left-0 flex w-11 items-center justify-center";

export const fieldEndAdornmentClassName =
  "absolute inset-y-0 right-0 flex w-11 items-center justify-center";
