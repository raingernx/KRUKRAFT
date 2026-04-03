import type { ComponentProps } from "react";

import { PriceLabel as UIPriceLabel } from "@/components/ui/PriceLabel";

export type PriceLabelProps = ComponentProps<typeof UIPriceLabel>;

function PriceLabel(props: PriceLabelProps) {
  return <UIPriceLabel {...props} />;
}

export { PriceLabel };
