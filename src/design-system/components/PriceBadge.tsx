import type { ComponentProps } from "react";

import { PriceBadge as UIPriceBadge } from "@/components/ui/PriceBadge";

export type PriceBadgeProps = ComponentProps<typeof UIPriceBadge>;

function PriceBadge(props: PriceBadgeProps) {
  return <UIPriceBadge {...props} />;
}

export { PriceBadge };
