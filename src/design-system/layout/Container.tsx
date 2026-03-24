import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  CONTAINER_BASE_CLASS_NAME,
  CONTAINER_CLASS_NAME,
  CONTAINER_NARROW_MAX_WIDTH_CLASS_NAME,
  CONTAINER_PADDING_CLASS_NAME,
  PAGE_CONTENT_MAX_WIDTH_CLASS_NAME,
  PAGE_CONTENT_NARROW_MAX_WIDTH_CLASS_NAME,
  PAGE_CONTENT_WIDE_MAX_WIDTH_CLASS_NAME,
} from "@/components/layout/container";

interface LayoutPrimitiveProps {
  children: ReactNode;
  className?: string;
}

interface ContainerProps extends LayoutPrimitiveProps {
  narrow?: boolean;
}

export function Container({ children, className, narrow = false }: ContainerProps) {
  return (
    <div
      className={cn(
        CONTAINER_CLASS_NAME,
        narrow && CONTAINER_NARROW_MAX_WIDTH_CLASS_NAME,
        className,
      )}
    >
      {children}
    </div>
  );
}

function PageWidth({
  children,
  className,
  maxWidthClassName,
}: LayoutPrimitiveProps & { maxWidthClassName: string }) {
  return (
    <div className={cn(CONTAINER_BASE_CLASS_NAME, maxWidthClassName, className)}>
      {children}
    </div>
  );
}

export function PageContainer({ children, className }: LayoutPrimitiveProps) {
  return <div className={cn("w-full", CONTAINER_PADDING_CLASS_NAME, className)}>{children}</div>;
}

export function PageContent({ children, className }: LayoutPrimitiveProps) {
  return (
    <PageWidth maxWidthClassName={PAGE_CONTENT_MAX_WIDTH_CLASS_NAME} className={className}>
      {children}
    </PageWidth>
  );
}

export function PageContentWide({ children, className }: LayoutPrimitiveProps) {
  return (
    <PageWidth maxWidthClassName={PAGE_CONTENT_WIDE_MAX_WIDTH_CLASS_NAME} className={className}>
      {children}
    </PageWidth>
  );
}

export function PageContentNarrow({ children, className }: LayoutPrimitiveProps) {
  return (
    <PageWidth maxWidthClassName={PAGE_CONTENT_NARROW_MAX_WIDTH_CLASS_NAME} className={className}>
      {children}
    </PageWidth>
  );
}
