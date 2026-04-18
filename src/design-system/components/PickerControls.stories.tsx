import type { Meta, StoryObj } from "@storybook/nextjs";
import { ImageIcon, MoreHorizontal, Trash2, Upload } from "@/lib/icons";

import {
  MediaPreview,
  PickerActionButton,
  PickerActions,
  PickerDropzoneShell,
  PickerIconButton,
  PreviewCard,
} from "./PickerControls";

const meta = {
  title: "Components/PickerControls",
  component: PickerActions,
  tags: ["autodocs"],
} satisfies Meta<typeof PickerActions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ActionRows: Story = {
  render: () => (
    <PickerActions>
      <PickerActionButton>
        <Upload className="size-4" />
        Upload image
      </PickerActionButton>
      <PickerActionButton tone="muted">
        <ImageIcon className="size-4" />
        Choose from gallery
      </PickerActionButton>
      <PickerActionButton tone="danger" actionStyle="dashed">
        <Trash2 className="size-4" />
        Remove image
      </PickerActionButton>
    </PickerActions>
  ),
};

export const IconButtonsAndPreview: Story = {
  render: () => (
    <div className="w-[440px] space-y-4">
      <PreviewCard className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">worksheet-cover.png</p>
          <p className="text-sm text-muted-foreground">1200 × 900 px</p>
        </div>
        <div className="flex gap-1">
          <PickerIconButton tone="info" aria-label="More info">
            <MoreHorizontal className="size-4" />
          </PickerIconButton>
          <PickerIconButton tone="danger" aria-label="Remove file">
            <Trash2 className="size-4" />
          </PickerIconButton>
        </div>
      </PreviewCard>
      <MediaPreview className="h-40 w-56">
        <img
          src="/brand/krukraft-mark.svg"
          alt="Media preview"
          className="h-full w-full object-contain bg-muted"
        />
      </MediaPreview>
    </div>
  ),
};

export const DropzoneStates: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-3">
      <PickerDropzoneShell>
        <Upload className="mb-2 size-5 text-muted-foreground" />
        <p className="font-medium text-foreground">Default dropzone</p>
        <p className="mt-1 text-xs text-muted-foreground">Click or drag files here</p>
      </PickerDropzoneShell>
      <PickerDropzoneShell active>
        <Upload className="mb-2 size-5 text-muted-foreground" />
        <p className="font-medium text-foreground">Active dropzone</p>
        <p className="mt-1 text-xs text-muted-foreground">Ready to receive a file</p>
      </PickerDropzoneShell>
      <PickerDropzoneShell reject>
        <Upload className="mb-2 size-5 text-muted-foreground" />
        <p className="font-medium text-foreground">Rejected file</p>
        <p className="mt-1 text-xs text-muted-foreground">Unsupported format or too large</p>
      </PickerDropzoneShell>
    </div>
  ),
};
