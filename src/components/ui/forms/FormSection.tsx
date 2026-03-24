"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSectionProps {
  title: string;
  description?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * Admin form section: quiet surface, subtle border, p-6, space-y-6.
 * Structure: Title, optional Description, then Children.
 */
export function FormSection({
  title,
  description,
  className,
  children,
}: FormSectionProps) {
  return (
    <section
      className={cn(
        "space-y-6 rounded-xl border border-border-subtle bg-white p-6 shadow-none",
        className
      )}
    >
      <div>
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {description && (
          <p className="mt-1 text-small text-text-secondary">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}
