import type { Meta, StoryObj } from "@storybook/nextjs";
import * as React from "react";
import { SlidersHorizontal, Sparkles } from "@/lib/icons";

import { Button } from "./Button";
import { Input } from "./Input";
import { SearchInput } from "./SearchInput";

const meta = {
  title: "Primitives/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
  args: {
    placeholder: "Search worksheets, flashcards, notes...",
  },
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: () => {
    const [value, setValue] = React.useState("science worksheets");

    return (
      <div className="w-[420px] space-y-4">
        <SearchInput
          placeholder="Search resources"
          value=""
          onChange={() => {}}
        />
        <SearchInput
          placeholder="Search resources"
          value=""
          onChange={() => {}}
          className="bg-muted/40"
        />
        <SearchInput
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onClear={() => setValue("")}
        />
        <SearchInput
          value="creator storefront"
          loading
          onChange={() => {}}
        />
      </div>
    );
  },
};

export const FoundationFamily: Story = {
  render: () => {
    const [query, setQuery] = React.useState("ecosystem worksheet");

    return (
      <div className="w-[560px] space-y-4 rounded-lg border border-border bg-card p-5">
        <Input placeholder="Resource title" />
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          onClear={() => setQuery("")}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button>Continue</Button>
          <Button variant="quiet">Secondary action</Button>
        </div>
      </div>
    );
  },
};

export const WithAdornments: Story = {
  render: () => (
    <div className="w-[520px] space-y-4">
      <SearchInput
        placeholder="Search creator resources"
        startAdornment={
          <Sparkles className="pointer-events-none absolute inset-y-0 left-0 h-full w-11 p-3 text-brand-600" />
        }
        endAdornment={
          <button
            type="button"
            className="absolute inset-y-0 right-0 w-11 text-muted-foreground transition-colors hover:text-foreground"
          >
            <SlidersHorizontal className="mx-auto size-4" />
            <span className="sr-only">Open filters</span>
          </button>
        }
      />
      <SearchInput
        placeholder="Search public library"
        submitButton={<Button variant="quiet">Browse</Button>}
      />
    </div>
  ),
};
