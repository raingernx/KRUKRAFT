import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Global SaaS layout container.
 *
 * Horizontally centers content, enforces a max-width of 1600px,
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
 * headings and paragraphs never stretch to the full 1600px container width.
 */
export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
