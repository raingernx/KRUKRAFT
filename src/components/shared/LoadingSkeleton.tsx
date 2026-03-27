import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  style?: CSSProperties;
}

/** Generic loading skeleton bar. */
export function LoadingSkeleton({ className, style }: LoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded bg-surface-100 motion-reduce:animate-none",
        className,
      )}
      style={style}
      aria-hidden
    />
  );
}
