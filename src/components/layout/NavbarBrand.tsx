"use client";

import { Logo } from "@/components/brand/Logo";

export function NavbarBrand() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center sm:w-[220px]">
      <Logo
        variant="full"
        size="md"
        className="hidden h-10 w-[220px] shrink-0 sm:flex"
        preferRepoAsset
      />
      <Logo
        variant="icon"
        size="md"
        className="flex h-10 w-10 shrink-0 sm:hidden"
        preferRepoAsset
      />
    </div>
  );
}
