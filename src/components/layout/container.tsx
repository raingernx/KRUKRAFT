import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const CONTAINER_BASE_CLASS_NAME = "mx-auto w-full min-w-0";
export const CONTAINER_MAX_WIDTH_CLASS_NAME =
  `${CONTAINER_BASE_CLASS_NAME} max-w-[var(--container-max-width)]`;
export const CONTAINER_NARROW_MAX_WIDTH_CLASS_NAME = "max-w-[var(--container-narrow-max-width)]";
export const CONTAINER_PADDING_CLASS_NAME = "px-4 sm:px-6 lg:px-8";
export const CONTAINER_CLASS_NAME =
  `${CONTAINER_MAX_WIDTH_CLASS_NAME} ${CONTAINER_PADDING_CLASS_NAME}`;
export const PAGE_CONTENT_MAX_WIDTH_CLASS_NAME = "max-w-[var(--page-content-max-width)]";
export const PAGE_CONTENT_WIDE_MAX_WIDTH_CLASS_NAME = "max-w-[var(--page-content-wide-max-width)]";
export const PAGE_CONTENT_NARROW_MAX_WIDTH_CLASS_NAME = "max-w-[var(--page-content-narrow-max-width)]";

/**
 * Global SaaS layout container.
 *
 * Horizontally centers content, enforces the shared app shell width,
 * and applies consistent responsive horizontal padding across all app areas.
 *
 * Usage:
 *   <Container>…page content…</Container>
 *
 * Hero sections should follow this pattern:
 *   <section className="w-full">
 *     <div className="bg-gradient-…">
 *       <Container>
 *         <p className="max-w-2xl">…hero text…</p>
 *       </Container>
 *     </div>
 *   </section>
 *
 * IMPORTANT: Always pair with max-w-2xl / max-w-3xl on text blocks so
 * headings and paragraphs never stretch to the full app shell width.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        CONTAINER_CLASS_NAME,
        className,
      )}
    >
      {children}
    </div>
  );
}
