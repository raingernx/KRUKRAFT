"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Button } from "@/design-system";
import type { DashboardAppViewer } from "@/components/dashboard/DashboardAppViewer";
import { DashboardSidebarContent } from "@/components/dashboard/DashboardSidebarContent";
import { X } from "@/lib/icons";

export function DashboardMobileNavigation({
  open,
  onOpenChange,
  viewer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  viewer: DashboardAppViewer;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[hsl(var(--card)/0.78)] backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border-subtle bg-card/95 shadow-card-lg outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden">
          <DialogPrimitive.Title className="sr-only">
            Dashboard navigation
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navigate between dashboard sections.
          </DialogPrimitive.Description>
          <DialogPrimitive.Close asChild>
            <Button
              aria-label="Close dashboard navigation"
              className="absolute right-3 top-3 size-11"
              size="icon"
              variant="ghost"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </DialogPrimitive.Close>
          <DashboardSidebarContent
            closeOnNavigate
            viewer={viewer}
            wrapNavigatedChild={({ key, child }) => (
              <DialogPrimitive.Close key={key} asChild>
                {child}
              </DialogPrimitive.Close>
            )}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
