"use client";

import { useEffect } from "react";

interface AutoScrollOnSuccessProps {
  /** When true, scrolls to #purchase-card once on mount. */
  enabled: boolean;
}

/**
 * Scrolls the purchase/download card into view after a successful payment
 * return. Runs once on mount; does nothing on normal page visits.
 * Renders nothing — purely behavioral.
 */
export function AutoScrollOnSuccess({ enabled }: AutoScrollOnSuccessProps) {
  useEffect(() => {
    if (!enabled) return;
    document
      .getElementById("purchase-card")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [enabled]);

  return null;
}
