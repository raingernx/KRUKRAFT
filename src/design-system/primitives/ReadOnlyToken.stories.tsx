import type { Meta, StoryObj } from "@storybook/nextjs";
import { ReadOnlyToken } from "./ReadOnlyToken";

const meta = {
  title: "Primitives/ReadOnlyToken",
  component: ReadOnlyToken,
  tags: ["autodocs"],
  args: {
    children: "Self-paced revision",
  },
} satisfies Meta<typeof ReadOnlyToken>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const ContentMetadata: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-5">
      <ReadOnlyToken>Test Prep learners</ReadOnlyToken>
      <ReadOnlyToken>Self-paced revision</ReadOnlyToken>
    </div>
  ),
};
