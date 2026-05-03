import type { Meta, StoryObj } from "@storybook/nextjs";
import { ArrowRight } from "@/lib/icons";
import { PillLink } from "./PillLink";

const meta = {
  title: "Primitives/PillLink",
  component: PillLink,
  tags: ["autodocs"],
  args: {
    href: "#",
    children: "View all",
  },
} satisfies Meta<typeof PillLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const SectionHeader: Story = {
  render: () => (
    <div className="rounded-2xl border border-border bg-card p-5">
      <PillLink href="#">
        <span>Browse everything</span>
        <ArrowRight aria-hidden="true" />
      </PillLink>
    </div>
  ),
};
