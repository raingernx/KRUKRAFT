"use client";

import { useState, useRef, useEffect } from "react";

interface ResourceDescriptionProps {
  /** Section heading */
  title?: string;
  description: string;
}

export function ResourceDescription({
  title = "About",
  description,
}: ResourceDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (expanded) return;
    const el = ref.current;
    if (!el) return;
    setNeedsToggle(el.scrollHeight > el.clientHeight);
  }, [description, expanded]);

  return (
    <section id="description" className="space-y-3 border-t border-surface-200 pt-6">
      <div className="space-y-1.5">
        <h2 className="font-display text-lg font-semibold text-zinc-900">{title}</h2>
        <p className="text-small leading-6 text-zinc-500">
          Review the scope, study value, and what this resource is designed to help you do.
        </p>
      </div>
      <p
        ref={ref}
        className={`text-body leading-7 text-zinc-600 ${!expanded ? "line-clamp-4" : ""}`}
      >
        {description}
      </p>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-small font-medium text-primary-700 transition hover:text-primary-800"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </section>
  );
}
