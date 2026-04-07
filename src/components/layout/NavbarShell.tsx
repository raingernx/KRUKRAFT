"use client";

import type { ReactNode } from "react";

import { NavbarBrand } from "@/components/layout/NavbarBrand";
import { Container } from "@/design-system";
import { cn } from "@/lib/utils";

const HORIZONTAL_SCROLL_CLASS_NAME =
  "overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden";

function NavbarShellAuthPlaceholder({
  marketplace = false,
  mobile = false,
}: {
  marketplace?: boolean;
  mobile?: boolean;
}) {
  if (mobile) {
    return (
      <div className="flex items-center gap-2">
        <div
          aria-hidden="true"
          className="h-10 w-24 rounded-full bg-muted"
        />
        <div
          aria-hidden="true"
          className="h-10 w-10 rounded-full bg-muted"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", marketplace ? "" : "gap-2")}>
      <div
        aria-hidden="true"
        className={cn(
          "rounded-full bg-muted",
          marketplace ? "h-10 w-[108px]" : "h-10 w-24",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "rounded-full bg-muted",
          marketplace ? "h-10 w-[52px]" : "h-10 w-28",
        )}
      />
    </div>
  );
}

export function NavbarShell({
  hasMarketplaceShell = false,
  headerSearch,
  secondaryRow,
}: {
  hasMarketplaceShell?: boolean;
  headerSearch?: ReactNode;
  secondaryRow?: ReactNode;
}) {
  if (hasMarketplaceShell) {
    return (
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
        <Container className="py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center gap-3 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-6">
              <div className="flex h-11 shrink-0 items-center">
                <NavbarBrand />
              </div>

              <div className="hidden min-w-0 lg:block">
                {headerSearch ?? (
                  <div
                    aria-hidden="true"
                    className="h-11 w-full rounded-full border border-border bg-background"
                  />
                )}
              </div>

              <div className="ml-auto hidden min-w-[176px] items-center justify-end gap-2.5 lg:flex">
                <NavbarShellAuthPlaceholder marketplace />
              </div>

              <div
                className={cn(
                  "ml-auto flex min-w-0 max-w-[68vw] items-center gap-1.5 lg:hidden",
                  HORIZONTAL_SCROLL_CLASS_NAME,
                )}
              >
                <NavbarShellAuthPlaceholder marketplace mobile />
              </div>
            </div>

            {secondaryRow ?? (
              <div
                className={cn(
                  "flex items-center gap-2",
                  HORIZONTAL_SCROLL_CLASS_NAME,
                )}
              >
                <div
                  aria-hidden="true"
                  className="h-10 w-[136px] shrink-0 rounded-full border border-border bg-secondary"
                />
                <div
                  aria-hidden="true"
                  className="h-10 w-[112px] shrink-0 rounded-full bg-background"
                />
                <div
                  aria-hidden="true"
                  className="h-10 w-[236px] shrink-0 rounded-full bg-background"
                />
                <div
                  aria-hidden="true"
                  className="h-10 w-[108px] shrink-0 rounded-full bg-background"
                />
                <div
                  aria-hidden="true"
                  className="h-10 w-[132px] shrink-0 rounded-full bg-background"
                />
              </div>
            )}
          </div>
        </Container>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <Container className="h-16">
        <div className="flex h-10 items-center">
          <NavbarBrand />
        </div>
      </Container>
    </header>
  );
}
