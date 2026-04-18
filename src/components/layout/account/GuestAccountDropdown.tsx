"use client";

import { useState, type ComponentType } from "react";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SidebarSectionLabel,
} from "@/design-system";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import type { AccountDropdownNavigateHandler } from "@/components/layout/account/AuthenticatedAccountDropdown";
import { cn } from "@/lib/utils";

export interface GuestAccountDropdownItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export interface GuestAccountDropdownProps {
  viewerLabel: string;
  previewTitle: string;
  previewDescription: string;
  items: readonly GuestAccountDropdownItem[];
  sectionLabel?: string;
  ariaLabel?: string;
  modal?: boolean;
  itemPrefetchScope?: string;
  onNavigate?: AccountDropdownNavigateHandler;
  onWarmTargets?: () => void;
  triggerClassName?: string;
  menuClassName?: string;
}

function GuestAccountMenuTrigger({
  viewerLabel,
  open,
  className,
}: {
  viewerLabel: string;
  open: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border transition-all group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background",
        open
          ? "border-border-strong bg-card shadow-card"
          : "border-border-subtle bg-card/90 hover:border-border hover:bg-muted/55",
        className,
      )}
    >
      <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
        {viewerLabel.charAt(0) || "A"}
      </span>
    </span>
  );
}

function GuestAccountMenuContext({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-2 border-b border-border-subtle px-2.5 pb-2 pt-1">
      <p className="text-xs font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function GuestAccountMenuItems({
  items,
  sectionLabel,
  itemPrefetchScope,
  onNavigate,
  onWarmTargets,
}: {
  items: readonly GuestAccountDropdownItem[];
  sectionLabel: string;
  itemPrefetchScope: string;
  onNavigate?: AccountDropdownNavigateHandler;
  onWarmTargets?: () => void;
}) {
  return (
    <div>
      <SidebarSectionLabel className="mb-1 mt-0 px-2.5">
        {sectionLabel}
      </SidebarSectionLabel>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <DropdownItem
            key={item.href}
            asChild
            className="rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
          >
            <IntentPrefetchLink
              href={item.href}
              prefetchLimit={4}
              prefetchScope={itemPrefetchScope}
              onMouseEnter={onWarmTargets}
              onFocus={onWarmTargets}
              onClick={(event) => {
                onNavigate?.(item.href, event);
              }}
            >
              <Icon
                aria-hidden
                className="h-[18px] w-[18px] shrink-0 opacity-80"
              />
              {item.label}
            </IntentPrefetchLink>
          </DropdownItem>
        );
      })}
    </div>
  );
}

export function GuestAccountDropdown({
  viewerLabel,
  previewTitle,
  previewDescription,
  items,
  sectionLabel = "GET STARTED",
  ariaLabel = "Open account menu",
  modal = false,
  itemPrefetchScope = "account-menu",
  onNavigate,
  onWarmTargets,
  triggerClassName,
  menuClassName,
}: GuestAccountDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown modal={modal} open={open} onOpenChange={setOpen}>
      <DropdownTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="group inline-flex size-11 items-center justify-center rounded-full outline-none"
        >
          <GuestAccountMenuTrigger
            viewerLabel={viewerLabel}
            open={open}
            className={triggerClassName}
          />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        align="end"
        className={cn(
          "w-[min(17rem,calc(100vw-1rem))] rounded-xl border-border-subtle bg-card/95 p-0 shadow-card-lg",
          menuClassName,
        )}
        sideOffset={8}
      >
        <div className="p-2">
          <GuestAccountMenuContext
            title={previewTitle}
            description={previewDescription}
          />
          <GuestAccountMenuItems
            items={items}
            sectionLabel={sectionLabel}
            itemPrefetchScope={itemPrefetchScope}
            onNavigate={onNavigate}
            onWarmTargets={onWarmTargets}
          />
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
