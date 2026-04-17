import type { Meta, StoryObj } from "@storybook/nextjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  PaginationButton,
  PaginationEllipsis,
  PaginationInfo,
  PaginationList,
  PaginationNav,
  buildPaginationItems,
} from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: PaginationNav,
  tags: ["autodocs"],
} satisfies Meta<typeof PaginationNav>;

export default meta;

type Story = StoryObj<typeof meta>;

function PaginationPreview({
  current,
  total,
  compact = false,
  withInfo = false,
}: {
  current: number;
  total: number;
  compact?: boolean;
  withInfo?: boolean;
}) {
  const size = compact ? "sm" : "md";
  const items = buildPaginationItems(current, total);

  return (
    <div className="space-y-3">
      {withInfo ? (
        <PaginationInfo>
          Showing page {current} of {total}
        </PaginationInfo>
      ) : null}
      <PaginationNav className="justify-start">
        <PaginationButton size={size} disabled={current === 1}>
          <ChevronLeft className="size-4" />
          {!compact ? "Previous" : null}
        </PaginationButton>
        <PaginationList>
          {items.map((item, index) =>
            item === "…" ? (
              <PaginationEllipsis key={`ellipsis-${index}`} />
            ) : (
              <PaginationButton key={item} size={size} active={item === current}>
                {item}
              </PaginationButton>
            ),
          )}
        </PaginationList>
        <PaginationButton size={size} disabled={current === total}>
          {!compact ? "Next" : null}
          <ChevronRight className="size-4" />
        </PaginationButton>
      </PaginationNav>
    </div>
  );
}

export const Default: Story = {
  render: () => <PaginationPreview current={4} total={9} withInfo />,
};

export const Compact: Story = {
  render: () => <PaginationPreview current={3} total={8} compact />,
};

export const EdgeStates: Story = {
  render: () => (
    <div className="space-y-6">
      <PaginationPreview current={1} total={10} withInfo />
      <PaginationPreview current={5} total={10} withInfo />
      <PaginationPreview current={10} total={10} withInfo />
    </div>
  ),
};

export const LongPageCount: Story = {
  render: () => <PaginationPreview current={12} total={24} withInfo />,
};
