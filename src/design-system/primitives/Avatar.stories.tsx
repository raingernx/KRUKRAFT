import type { Meta, StoryObj } from "@storybook/nextjs";

import { Avatar } from "./Avatar";

const meta = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    name: "Sandstorm Assets",
    email: "sandstorm.assets@gmail.com",
    size: 40,
  },
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Fallbacks: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar name="Sandstorm Assets" size={40} />
        <span className="text-sm text-foreground">Initials from name</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar email="creator.workspace@gmail.com" size={40} />
        <span className="text-sm text-foreground">Fallback from email</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar initials="KK" size={40} />
        <span className="text-sm text-foreground">Explicit initials override</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar size={40} />
        <span className="text-sm text-foreground">Anonymous default</span>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Avatar name="Sandstorm Assets" size={24} />
      <Avatar name="Sandstorm Assets" size={32} />
      <Avatar name="Sandstorm Assets" size={40} />
      <Avatar name="Sandstorm Assets" size={56} />
    </div>
  ),
};

export const ImageAndFallback: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-3">
        <Avatar
          src="/brand/krukraft-mark.svg"
          alt="Krukraft mark"
          name="Krukraft"
          size={48}
          className="bg-surface-0"
        />
        <span className="text-sm text-foreground">Image avatar</span>
      </div>
      <div className="flex items-center gap-3">
        <Avatar name="Krukraft" size={48} />
        <span className="text-sm text-foreground">Fallback avatar</span>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => (
    <div className="w-[360px] rounded-2xl border border-border bg-card p-4 shadow-card-sm">
      <div className="flex items-center gap-3">
        <Avatar
          src="/brand/krukraft-mark.svg"
          alt="Krukraft mark"
          name="Sandstorm Assets"
          email="sandstorm.assets@gmail.com"
          size={40}
          className="bg-surface-0"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">Sandstorm Assets</p>
          <p className="truncate text-sm text-muted-foreground">
            sandstorm.assets@gmail.com
          </p>
        </div>
      </div>
    </div>
  ),
};
