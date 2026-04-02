import type { Meta, StoryObj } from "@storybook/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./Card";
import { Button } from "./Button";

const meta = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Creator onboarding checklist</CardTitle>
        <CardDescription>
          A compact card shell for dashboards, empty states, and callouts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-text-secondary">
        <p>Upload a thumbnail and three preview images.</p>
        <p>Write a benefit-led title and category-aligned description.</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm">Open checklist</Button>
      </CardFooter>
    </Card>
  ),
};
