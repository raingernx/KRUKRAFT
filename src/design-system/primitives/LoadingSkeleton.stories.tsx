import type { Meta, StoryObj } from "@storybook/nextjs";

import { LoadingSkeleton } from "./LoadingSkeleton";

const meta = {
  title: "Primitives/LoadingSkeleton",
  component: LoadingSkeleton,
  tags: ["autodocs"],
  args: {
    className: "h-4 w-32",
  },
} satisfies Meta<typeof LoadingSkeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <LoadingSkeleton className="h-3 w-24" />
      <LoadingSkeleton className="h-5 w-40 rounded-lg" />
      <LoadingSkeleton className="size-10 rounded-full" />
      <LoadingSkeleton className="h-10 w-28 rounded-full" />
    </div>
  ),
};

export const ContentBlock: Story = {
  render: () => (
    <div className="w-[360px] rounded-2xl border border-border bg-card p-5 shadow-card-sm">
      <div className="space-y-4">
        <LoadingSkeleton className="h-5 w-36" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-[92%]" />
          <LoadingSkeleton className="h-4 w-[68%]" />
        </div>
        <LoadingSkeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  ),
};

export const TableRow: Story = {
  render: () => (
    <div className="w-[720px] rounded-2xl border border-border bg-card p-4 shadow-card-sm">
      <div className="grid grid-cols-[2.2fr_1.2fr_1fr_auto] items-center gap-4">
        <div className="flex items-center gap-3">
          <LoadingSkeleton className="size-10 rounded-xl" />
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-40" />
            <LoadingSkeleton className="h-3 w-28" />
          </div>
        </div>
        <LoadingSkeleton className="h-4 w-20" />
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-9 w-20 rounded-full" />
      </div>
    </div>
  ),
};

export const DarkSurfacePreview: Story = {
  render: () => (
    <div className="w-[420px] rounded-[28px] bg-[#111b33] p-6">
      <div className="space-y-4">
        <LoadingSkeleton className="h-5 w-36 bg-white/10" />
        <LoadingSkeleton className="h-11 w-full rounded-xl bg-white/10" />
        <div className="grid grid-cols-2 gap-3">
          <LoadingSkeleton className="h-24 rounded-2xl bg-white/10" />
          <LoadingSkeleton className="h-24 rounded-2xl bg-white/10" />
        </div>
      </div>
    </div>
  ),
};
