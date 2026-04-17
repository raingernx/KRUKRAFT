import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "@/design-system/primitives/Button";
import { Input } from "@/design-system/primitives/Input";
import { Select } from "@/design-system/primitives/Select";

import { FormSection } from "./FormSection";

const meta = {
  title: "Components/FormSection",
  component: FormSection,
  tags: ["autodocs"],
  args: {
    title: "Listing details",
    description: "Use a clear title and category so buyers can scan the page quickly.",
    children: null,
  },
} satisfies Meta<typeof FormSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <div className="w-[640px]">
      <FormSection
        {...args}
        footer={
          <div className="flex justify-end">
            <Button size="sm">Save changes</Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Resource title" />
          <Select defaultValue="worksheet">
            <option value="worksheet">Worksheet</option>
            <option value="flashcards">Flashcards</option>
            <option value="lesson-plan">Lesson plan</option>
          </Select>
        </div>
      </FormSection>
    </div>
  ),
};

export const Flat: Story = {
  render: () => (
    <div className="w-[680px]">
      <FormSection
        title="Creator profile"
        description="This is the default flat treatment for settings and admin forms."
        footer={
          <div className="flex justify-end">
            <Button size="sm">Update profile</Button>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Input defaultValue="Sandstorm Assets" />
          <Input defaultValue="sandstorm.assets@gmail.com" />
        </div>
      </FormSection>
    </div>
  ),
};

export const CardVariant: Story = {
  render: () => (
    <div className="w-[680px]">
      <FormSection
        title="Membership settings"
        description="Use the card variant only when the section needs a clearly bounded shell."
        variant="card"
        footer={
          <>
            <Button size="sm" variant="ghost">
              Cancel
            </Button>
            <Button size="sm">Save plan</Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select defaultValue="pro">
            <option value="starter">Starter</option>
            <option value="pro">Pro</option>
            <option value="team">Team</option>
          </Select>
          <Input defaultValue="Monthly renewal" />
        </div>
      </FormSection>
    </div>
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <div className="w-[680px]">
      <FormSection title="Quick action" footer={<Button size="sm">Assign access</Button>}>
        <Input placeholder="Email address" />
      </FormSection>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className="w-[720px]">
      <FormSection
        title="Resource publishing settings"
        description="Longer content blocks should still preserve section rhythm and footer placement."
        footer={
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost">
              Back
            </Button>
            <Button size="sm">Continue</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input defaultValue="Middle School Science Assessment Pack" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Select defaultValue="science">
              <option value="science">Science</option>
              <option value="math">Math</option>
              <option value="english">English</option>
            </Select>
            <Select defaultValue="grade-7">
              <option value="grade-6">Grade 6</option>
              <option value="grade-7">Grade 7</option>
              <option value="grade-8">Grade 8</option>
            </Select>
          </div>
          <Input defaultValue="Worksheet bundle with answer key and review quiz" />
        </div>
      </FormSection>
    </div>
  ),
};
