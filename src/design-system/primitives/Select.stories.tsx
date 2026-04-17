import type { Meta, StoryObj } from "@storybook/nextjs";

import { Select } from "./Select";

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    defaultValue: "",
    children: (
      <>
        <option value="" disabled>
          Choose a resource type
        </option>
        <option value="worksheet">Worksheet</option>
        <option value="flashcards">Flashcards</option>
        <option value="lesson-plan">Lesson plan</option>
        <option value="quiz">Quiz</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => (
    <div className="w-[360px] space-y-4">
      <Select defaultValue="" hint="Use format to narrow large result sets.">
        <option value="" disabled>
          Choose a resource type
        </option>
        <option value="worksheet">Worksheet</option>
        <option value="flashcards">Flashcards</option>
        <option value="lesson-plan">Lesson plan</option>
        <option value="quiz">Quiz</option>
      </Select>
      <Select defaultValue="flashcards" hint="The selected state should stay readable.">
        <option value="" disabled>
          Choose a resource type
        </option>
        <option value="worksheet">Worksheet</option>
        <option value="flashcards">Flashcards</option>
        <option value="lesson-plan">Lesson plan</option>
        <option value="quiz">Quiz</option>
      </Select>
      <Select defaultValue="quiz" error="Pick a format that matches the uploaded file.">
        <option value="" disabled>
          Choose a resource type
        </option>
        <option value="worksheet">Worksheet</option>
        <option value="flashcards">Flashcards</option>
        <option value="lesson-plan">Lesson plan</option>
        <option value="quiz">Quiz</option>
      </Select>
      <Select defaultValue="worksheet" disabled hint="Disabled states should keep enough contrast.">
        <option value="" disabled>
          Choose a resource type
        </option>
        <option value="worksheet">Worksheet</option>
        <option value="flashcards">Flashcards</option>
        <option value="lesson-plan">Lesson plan</option>
        <option value="quiz">Quiz</option>
      </Select>
    </div>
  ),
};

export const Widths: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="w-[220px]">
        <Select defaultValue="worksheet" hint="Compact form width">
          <option value="worksheet">Worksheet</option>
          <option value="flashcards">Flashcards</option>
          <option value="lesson-plan">Lesson plan</option>
        </Select>
      </div>
      <div className="w-[420px]">
        <Select defaultValue="lesson-plan" hint="Wider form width">
          <option value="worksheet">Worksheet</option>
          <option value="flashcards">Flashcards</option>
          <option value="lesson-plan">Lesson plan</option>
        </Select>
      </div>
    </div>
  ),
};

export const LongOptions: Story = {
  render: () => (
    <div className="w-[420px]">
      <Select defaultValue="science-pack" hint="Long option labels should remain readable.">
        <option value="science-pack">
          Middle School Science Worksheet and Lab Reflection Bundle
        </option>
        <option value="reading-pack">
          Upper Primary Reading Comprehension and Guided Annotation Set
        </option>
        <option value="vocabulary-pack">
          Everyday English Vocabulary Flashcards with Review Quiz Pack
        </option>
      </Select>
    </div>
  ),
};
