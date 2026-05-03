import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmptyStatePillLink } from "./EmptyStatePillLink";

const meta = {
  title: "Primitives/EmptyStatePillLink",
  component: EmptyStatePillLink,
  tags: ["autodocs"],
  args: {
    href: "#",
    children: "Explore all resources",
  },
} satisfies Meta<typeof EmptyStatePillLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const EmptyStateAction: Story = {
  render: () => (
    <div className="rounded-2xl border border-border bg-card p-6 text-center">
      <EmptyStatePillLink href="#">Clear filters</EmptyStatePillLink>
    </div>
  ),
};
