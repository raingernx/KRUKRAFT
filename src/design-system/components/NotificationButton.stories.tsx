import type { Meta, StoryObj } from "@storybook/nextjs";

import { NotificationButton } from "./NotificationButton";

const meta = {
  title: "Components/NotificationButton",
  component: NotificationButton,
  tags: ["autodocs"],
  args: {
    count: 0,
  },
} satisfies Meta<typeof NotificationButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Counts: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <NotificationButton count={0} />
      <NotificationButton count={3} />
      <NotificationButton count={12} />
    </div>
  ),
};
