import type { Meta, StoryObj } from "@storybook/nextjs";

import { PriceBadge } from "./PriceBadge";

const meta = {
  title: "Components/PriceBadge",
  component: PriceBadge,
  tags: ["autodocs"],
  args: {
    priceMinorUnits: 0,
    isFree: true,
  },
} satisfies Meta<typeof PriceBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <PriceBadge priceMinorUnits={0} isFree />
      <PriceBadge priceMinorUnits={15000} />
      <PriceBadge priceMinorUnits={9900} currency="USD" />
    </div>
  ),
};
