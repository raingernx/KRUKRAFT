import type { Meta, StoryObj } from "@storybook/nextjs";
import { Badge } from "./Badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Owned",
    variant: "owned",
  },
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="owned">Owned</Badge>
      <Badge variant="featured">Featured</Badge>
      <Badge variant="new">New</Badge>
      <Badge variant="free">Free</Badge>
      <Badge variant="warning">Low stock</Badge>
      <Badge variant="info">Updated</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};
