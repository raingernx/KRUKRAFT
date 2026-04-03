import { formatPrice } from "@/lib/format";

export interface PriceLabelProps {
  price: number | null | undefined;
  isFree?: boolean;
}

export function PriceLabel({ price, isFree }: PriceLabelProps) {
  const resolvedPrice = price ?? 0;

  if (isFree || resolvedPrice === 0) {
    return <span className="font-medium text-green-600">Free</span>;
  }

  // Resource prices are stored in satang and need converting back to THB.
  const baht = resolvedPrice / 100;

  return (
    <span className="font-semibold text-neutral-900">
      {formatPrice(baht)}
    </span>
  );
}
