"use client";

import type { ComponentProps } from "react";

import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";

type ResourceIntentLinkProps = Omit<
  ComponentProps<typeof IntentPrefetchLink>,
  "resourcesNavigationMode"
>;

export function ResourceIntentLink(props: ResourceIntentLinkProps) {
  return (
    <IntentPrefetchLink
      {...props}
      resourcesNavigationMode="detail"
    />
  );
}
