import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "@/design-system/primitives/Button";

import { SectionHeader } from "./SectionHeader";

const meta = {
  title: "Components/SectionHeader",
  component: SectionHeader,
  tags: ["autodocs"],
  args: {
    eyebrow: "Creator workspace",
    title: "Manage your catalog",
    description: "Keep headings sharp, readable, and consistent across admin and dashboard surfaces.",
  },
} satisfies Meta<typeof SectionHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[760px]">
      <SectionHeader {...args} />
    </div>
  ),
};

export const LeftAligned: Story = {
  render: () => (
    <div className="w-[760px]">
      <SectionHeader
        eyebrow="Dashboard"
        title="Recent purchases"
        description="This is the default left-aligned contract for data-heavy sections."
      />
    </div>
  ),
};

export const Centered: Story = {
  render: () => (
    <div className="w-[760px] rounded-[28px] bg-[#111b33] p-8">
      <SectionHeader
        eyebrow="Marketplace"
        title="Find your next classroom resource"
        description="Centered alignment is better for intro blocks and broad browse entry points."
        align="center"
        className="text-white"
      />
    </div>
  ),
};

export const WithActions: Story = {
  render: () => (
    <div className="w-[760px]">
      <SectionHeader
        eyebrow="Admin"
        title="Resource moderation"
        description="Action slots should sit cleanly beside the copy block without collapsing hierarchy."
        actions={
          <div className="flex gap-2">
            <Button size="md" variant="quiet">
              Quiet action
            </Button>
            <Button size="md">Primary action</Button>
          </div>
        }
      />
    </div>
  ),
};

export const Minimal: Story = {
  render: () => (
    <div className="w-[760px]">
      <SectionHeader title="Subscription overview" />
    </div>
  ),
};
