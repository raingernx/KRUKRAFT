import type { Meta, StoryObj } from "@storybook/nextjs";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Continue",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="accent">Accent</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button leftIcon={<Download className="h-4 w-4" />}>Download</Button>
      <Button rightIcon={<ArrowRight className="h-4 w-4" />} variant="outline">
        Learn more
      </Button>
      <Button loading>Saving changes</Button>
    </div>
  ),
};

export const Density: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Secondary action</Button>
      <Button size="md">Primary action</Button>
      <Button size="lg" variant="outline">
        Review details
      </Button>
    </div>
  ),
};
