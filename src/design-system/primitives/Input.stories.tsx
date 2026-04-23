import type { Meta, StoryObj } from "@storybook/nextjs";
import { Search, Sparkles } from "@/lib/icons";

import { Input } from "./Input";

const meta = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Search worksheets, flashcards, notes...",
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="w-[360px] space-y-4">
      <Input placeholder="name@example.com" hint="Default and hover keep placeholder tone quiet." />
      <Input
        defaultValue="Flashcards"
        hint="Typed values should use the same shell recipe."
      />
      <Input
        defaultValue="worksheet"
        error="Try a broader term or choose a category instead."
      />
      <Input defaultValue="Unavailable in this state" readOnly />
      <Input disabled placeholder="Disabled field" />
    </div>
  ),
};

export const WithAdornments: Story = {
  render: () => (
    <div className="w-[360px] space-y-4">
      <Input
        placeholder="Search creator resources"
        leftAdornment={<Search className="size-4" />}
        rightAdornment={<Sparkles className="size-4" />}
      />
      <Input
        defaultValue="science flashcards"
        leftAdornment={<Search className="size-4" />}
        hint="Adornments should stay inside the same field family."
      />
    </div>
  ),
};
