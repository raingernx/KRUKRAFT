"use client";

import { Logo } from "@/components/brand/Logo";

export function NavbarBrand() {
  return (
    <>
      <Logo
        variant="full"
        size="navbar"
        preferRepoAsset
        className="hidden shrink-0 sm:inline-flex"
      />
      <Logo
        variant="icon"
        size="navbar"
        preferRepoAsset
        className="inline-flex shrink-0 sm:hidden"
      />
    </>
  );
}
