import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";

import { Button } from "./Button";
import { Modal } from "./Modal";

const meta = {
  title: "Primitives/Modal",
  component: Modal.Content,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Modal.Content>;

export default meta;

type Story = StoryObj<typeof meta>;

function OpenModalShell({
  size = "md",
  title,
  description,
  body,
  footer,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  title: string;
  description: string;
  body: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-[520px]">
      <Modal.Root defaultOpen modal={false}>
        <Modal.Content size={size}>
          <Modal.Header>
            <Modal.Title>{title}</Modal.Title>
            <Modal.Description>{description}</Modal.Description>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

export const Playground: Story = {
  render: () => (
    <OpenModalShell
      title="Save resource draft"
      description="Capture your current edits without sending the listing live."
      body={
        <div className="space-y-3 text-sm text-foreground">
          <p>Your thumbnail, pricing, and description will stay editable after this save.</p>
          <p className="text-muted-foreground">
            Drafts remain private until you publish the resource from the creator workspace.
          </p>
        </div>
      }
      footer={
        <>
          <Button variant="ghost">Cancel</Button>
          <Button>Save draft</Button>
        </>
      }
    />
  ),
};

export const ConfirmPattern: Story = {
  render: () => (
    <OpenModalShell
      size="sm"
      title="Remove resource from library?"
      description="Students who already purchased it keep access, but new buyers will no longer see it."
      body={
        <p className="text-sm text-foreground">
          This action hides the resource from public search and creator storefront listings.
        </p>
      }
      footer={
        <>
          <Button variant="ghost">Keep listed</Button>
          <Button variant="danger">Remove listing</Button>
        </>
      }
    />
  ),
};

export const LongContent: Story = {
  render: () => (
    <OpenModalShell
      size="lg"
      title="Membership plan comparison"
      description="Use the modal shell for longer decision content without losing hierarchy."
      body={
        <div className="space-y-4 text-sm text-foreground">
          <p>
            Pro membership unlocks unlimited downloads, creator profile customization, and weekly
            sales summaries with storefront analytics.
          </p>
          <p>
            Classroom teams can centralize billing, share purchased resources across assigned
            teachers, and keep renewal dates under one account owner.
          </p>
          <p className="text-muted-foreground">
            This story exists to verify spacing, scrolling, and readable long-form body copy inside
            the shared modal shell.
          </p>
          <div className="rounded-2xl border border-border-subtle bg-muted/50 p-4">
            <p className="font-medium text-foreground">Included benefits</p>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>Unlimited access to eligible membership resources</li>
              <li>Priority creator support response window</li>
              <li>Weekly digest for new releases and top-performing listings</li>
            </ul>
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="ghost">Not now</Button>
          <Button variant="accent">Upgrade plan</Button>
        </>
      }
    />
  ),
};

export const FooterActions: Story = {
  render: () => (
    <OpenModalShell
      title="Assign creator access"
      description="Use the footer slot for compact multi-action decision rows."
      body={
        <div className="space-y-2 text-sm text-foreground">
          <p>Invite this account into the creator workspace with publishing access.</p>
          <p className="text-muted-foreground">
            The footer should remain visually distinct from the main body without becoming another
            nested card.
          </p>
        </div>
      }
      footer={
        <>
          <Button variant="ghost">Back</Button>
          <Button variant="outline">Save as draft</Button>
          <Button>Send invite</Button>
        </>
      }
    />
  ),
};
