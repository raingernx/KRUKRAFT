import type { Meta, StoryObj } from "@storybook/nextjs";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "@/lib/icons";

import { RowActionButton, RowActionMenuTrigger, RowActions } from "./RowActions";

const meta = {
  title: "Components/RowActions",
  component: RowActions,
  tags: ["autodocs"],
} satisfies Meta<typeof RowActions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: () => (
    <RowActions>
      <RowActionButton>
        <Eye className="size-3.5" />
        View
      </RowActionButton>
      <RowActionButton tone="muted">
        <Pencil className="size-3.5" />
        Edit
      </RowActionButton>
      <RowActionMenuTrigger>
        <MoreHorizontal className="size-3.5" />
      </RowActionMenuTrigger>
    </RowActions>
  ),
};

export const DefaultCluster: Story = {
  render: () => (
    <RowActions>
      <RowActionButton>
        <Eye className="size-3.5" />
        Preview
      </RowActionButton>
      <RowActionButton tone="muted">
        <Pencil className="size-3.5" />
        Edit
      </RowActionButton>
      <RowActionButton tone="danger">
        <Trash2 className="size-3.5" />
        Delete
      </RowActionButton>
    </RowActions>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <RowActionButton tone="default">Default</RowActionButton>
      <RowActionButton tone="muted">Muted</RowActionButton>
      <RowActionButton tone="success">Success</RowActionButton>
      <RowActionButton tone="danger">Danger</RowActionButton>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <RowActions>
      <RowActionButton iconOnly aria-label="Preview">
        <Eye className="size-3.5" />
      </RowActionButton>
      <RowActionButton iconOnly tone="muted" aria-label="Edit">
        <Pencil className="size-3.5" />
      </RowActionButton>
      <RowActionMenuTrigger>
        <MoreHorizontal className="size-3.5" />
      </RowActionMenuTrigger>
    </RowActions>
  ),
};

export const InTableCell: Story = {
  render: () => (
    <div className="w-[760px] rounded-2xl border border-border bg-card p-4 shadow-card-sm">
      <div className="grid grid-cols-[1.8fr_1fr_auto] items-center gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">Science assessment worksheet pack</p>
          <p className="text-sm text-muted-foreground">Updated 2 hours ago</p>
        </div>
        <p className="text-sm text-muted-foreground">Draft</p>
        <RowActions>
          <RowActionButton size="md" tone="muted">
            <Pencil className="size-3.5" />
            Edit
          </RowActionButton>
          <RowActionMenuTrigger size="md">
            <MoreHorizontal className="size-3.5" />
          </RowActionMenuTrigger>
        </RowActions>
      </div>
    </div>
  ),
};
