import type { Meta, StoryObj } from "@storybook/nextjs";
import { BookOpen } from "@/lib/icons";
import { Button } from "@/design-system/primitives/Button";
import { EmptyState } from "./EmptyState";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "No resources yet",
    description:
      "Create your first listing to start building your public storefront.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <BookOpen className="h-6 w-6 text-zinc-400" />,
    action: <Button size="sm" variant="quiet">Quiet action</Button>,
  },
};
