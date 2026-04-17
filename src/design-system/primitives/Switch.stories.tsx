import type { Meta, StoryObj } from "@storybook/nextjs"
import * as React from "react"

import { Switch } from "./Switch"

const meta = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  args: {
    checked: false,
  },
} satisfies Meta<typeof Switch>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const States: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(true)

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border border-border-subtle bg-card p-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Enable creator alerts</p>
            <p className="text-sm text-muted-foreground">Get notified when sales spike or payouts fail.</p>
          </div>
          <Switch checked={checked} onCheckedChange={setChecked} />
        </div>
        <div className="flex items-center gap-4">
          <Switch checked={false} />
          <Switch checked />
          <Switch checked={false} disabled />
          <Switch checked disabled />
        </div>
      </div>
    )
  },
}
