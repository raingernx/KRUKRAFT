import type { Meta, StoryObj } from "@storybook/nextjs";

import { ResourceCard, type ResourceCardResource } from "./ResourceCard";

const fixture: ResourceCardResource = {
  id: "storybook-resource-card",
  slug: "middle-school-science-assessment-pack",
  title: "Middle School Science Assessment Pack",
  description: "Worksheet bundle with quizzes, answer key, and quick review prompts.",
  price: 2500,
  isFree: false,
  featured: true,
  createdAt: "2026-04-01T00:00:00.000Z",
  thumbnailUrl: "/brand/krukraft-mark.svg",
  author: { name: "Sandstorm Assets" },
  category: { name: "Science", slug: "science" },
  salesCount: 146,
};

const meta = {
  title: "Components/ResourceCard",
  component: ResourceCard,
  tags: ["autodocs"],
  args: {
    resource: fixture,
    previewMode: true,
    linkPrefetchMode: "none",
  },
} satisfies Meta<typeof ResourceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Marketplace: Story = {
  args: {
    resource: fixture,
    variant: "marketplace",
    previewMode: true,
  },
};

export const Library: Story = {
  args: {
    resource: {
      ...fixture,
      downloadedAt: new Date("2026-04-12T00:00:00.000Z"),
      mimeType: "application/pdf",
    },
    variant: "library",
  },
};

export const Hero: Story = {
  render: () => (
    <div className="w-[360px]">
      <ResourceCard
        resource={{
          ...fixture,
          highlightBadge: "Best seller",
          socialProofLabel: "Used by 100+ teachers",
        }}
        variant="hero"
        previewMode
        linkPrefetchMode="none"
        imageLoading="eager"
      />
    </div>
  ),
};

export const CompactAndFree: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <ResourceCard
        resource={{
          ...fixture,
          title: "Quick vocabulary flashcards",
          price: 0,
          isFree: true,
          featured: false,
          salesCount: 38,
        }}
        variant="compact"
        previewMode
        linkPrefetchMode="none"
      />
      <ResourceCard
        resource={{
          ...fixture,
          title: "Reading comprehension warm-up set",
          price: 1200,
          featured: false,
          salesCount: 82,
        }}
        variant="preview"
        previewMode
        linkPrefetchMode="none"
      />
    </div>
  ),
};
