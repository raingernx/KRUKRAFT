import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { Chip, ChipButton, ChipRemoveButton } from "./Chip";

const meta = {
  title: "Primitives/Chip",
  component: ChipButton,
  tags: ["autodocs"],
  args: {
    children: "Navigation chip",
    variant: "navigation",
  },
} satisfies Meta<typeof ChipButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Foundations: Story = {
  render: () => (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-5">
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Navigation</p>
        <div className="flex flex-wrap gap-3">
          <ChipButton variant="navigation">Default</ChipButton>
          <ChipButton variant="navigation" selected>
            Active
          </ChipButton>
          <ChipButton variant="navigation" pending>
            Pending
          </ChipButton>
          <ChipButton variant="navigation" disabled>
            Disabled
          </ChipButton>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Filter</p>
        <div className="flex flex-wrap gap-3">
          <ChipButton variant="filter">Subject</ChipButton>
          <ChipButton variant="filter" selected>
            Active filter
          </ChipButton>
          <ChipButton variant="filter" disabled>
            Disabled
          </ChipButton>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground">Removable</p>
        <div className="flex flex-wrap gap-3">
          <Chip variant="removable" className="pr-3">
            <span>Search: Geometry</span>
            <ChipRemoveButton aria-label="Remove search filter" />
          </Chip>
          <Chip variant="removable" className="pr-3 opacity-60">
            <span>Disabled</span>
            <ChipRemoveButton aria-label="Remove disabled chip" disabled />
          </Chip>
        </div>
      </div>
    </div>
  ),
};

export const InContext: Story = {
  render: () => {
    const [categories, setCategories] = React.useState([
      "All",
      "Language",
      "Mathematics",
      "Science",
    ]);

    return (
      <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap gap-3">
          <ChipButton variant="navigation" selected>
            All
          </ChipButton>
          <ChipButton variant="navigation">Language</ChipButton>
          <ChipButton variant="navigation">Mathematics</ChipButton>
          <ChipButton variant="navigation">Science</ChipButton>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <Chip key={category} variant="removable" className="pr-3">
              <span>{category}</span>
              <ChipRemoveButton
                aria-label={`Remove ${category}`}
                onClick={() =>
                  setCategories((current) => current.filter((item) => item !== category))
                }
              />
            </Chip>
          ))}
        </div>
      </div>
    );
  },
};
