import type { Meta, StoryObj } from "@storybook/nextjs";

import { Textarea } from "./Textarea";

const meta = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Describe what makes this resource useful in the classroom...",
  },
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="w-[420px] space-y-4">
      <Textarea
        hint="Give enough context for teachers to know what students will practice."
        placeholder="Write a short resource summary"
      />
      <Textarea
        defaultValue="A compact worksheet set for grade 4 learners covering food chains and habitats."
        hint="Selected content should keep comfortable line-height and padding."
      />
      <Textarea
        defaultValue="Too short"
        error="Add at least one learning outcome and a clearer activity summary."
      />
      <Textarea
        defaultValue="This field is locked while the upload is processing."
        disabled
        hint="Disabled state should remain readable without looking active."
      />
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="w-[520px]">
      <Textarea
        defaultValue={`This bundle includes guided reading prompts, short-form comprehension checks, and scaffolded vocabulary tasks for mixed-ability classrooms.

Teachers can use the pages as a one-week literacy pack or split them into warm-up tasks across a longer unit.

Each sheet is designed to print cleanly and also works for tablet annotation.`}
        hint="Long-form authoring should feel comfortable, not cramped."
      />
    </div>
  ),
};
