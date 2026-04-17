import type { Meta, StoryObj } from "@storybook/nextjs"
import * as React from "react"

import { Button } from "./Button"
import {
  Dropdown,
  DropdownCheckboxItem,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownRadioGroup,
  DropdownRadioItem,
  DropdownSeparator,
  DropdownTrigger,
} from "./Dropdown"

const meta = {
  title: "Primitives/Dropdown",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Dropdown open modal={false}>
      <DropdownTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownLabel>Quick actions</DropdownLabel>
        <DropdownItem>Open dashboard</DropdownItem>
        <DropdownItem>Manage billing</DropdownItem>
        <DropdownSeparator />
        <DropdownItem destructive>Delete workspace</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ),
}

export const SelectionStates: Story = {
  render: () => {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true)
    const [theme, setTheme] = React.useState("system")

    return (
      <Dropdown open modal={false}>
        <DropdownTrigger asChild>
          <Button variant="secondary">Preferences</Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel>Preferences</DropdownLabel>
          <DropdownCheckboxItem
            checked={notificationsEnabled}
            onCheckedChange={(checked) => setNotificationsEnabled(Boolean(checked))}
          >
            Email notifications
          </DropdownCheckboxItem>
          <DropdownSeparator />
          <DropdownLabel>Theme</DropdownLabel>
          <DropdownRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownRadioItem value="light">Light</DropdownRadioItem>
            <DropdownRadioItem value="dark">Dark</DropdownRadioItem>
            <DropdownRadioItem value="system">System</DropdownRadioItem>
          </DropdownRadioGroup>
        </DropdownMenu>
      </Dropdown>
    )
  },
}
