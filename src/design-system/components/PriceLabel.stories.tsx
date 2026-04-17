import type { Meta, StoryObj } from "@storybook/nextjs";

import { PriceLabel } from "./PriceLabel";

const meta = {
  title: "Components/PriceLabel",
  component: PriceLabel,
  tags: ["autodocs"],
  args: {
    price: 0,
    isFree: true,
  },
} satisfies Meta<typeof PriceLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-base">
      <PriceLabel price={0} isFree />
      <PriceLabel price={2500} />
      <PriceLabel price={12900} className="text-xl" />
    </div>
  ),
};
