import type { Meta, StoryObj } from "@storybook/nextjs";
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
      <Input placeholder="Search resources" hint="Use topic, grade, or format" />
      <Input
        defaultValue="Flashcards"
        hint="Visible helper text is part of the component contract"
      />
      <Input
        defaultValue="worksheet"
        error="Try a broader term or choose a category instead."
      />
    </div>
  ),
};
