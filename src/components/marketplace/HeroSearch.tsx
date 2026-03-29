"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { SearchInput } from "@/design-system";
import { cn } from "@/lib/utils";
import { beginResourcesNavigation } from "@/components/marketplace/resourcesNavigationState";

type HeroSearchVariant = "hero" | "listing";

interface HeroSearchProps {
  variant?: HeroSearchVariant;
  className?: string;
  placeholder?: string;
}

/**
 * Large hero-sized search bar for the Marketplace page.
 * Reads/writes the ?search= URL param; resets to page 1 on every submit.
 * Uses useTransition so the form shows a pending state immediately while
 * the route is loading — eliminates the frozen-click feeling on submit.
 */
export function HeroSearch({
  variant = "hero",
  className,
  placeholder = "ค้นหาใบงาน แฟลชการ์ด โน้ต...",
}: HeroSearchProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(searchParams.get("search") ?? "");

  // Keep the input in sync with the URL (browser back/forward)
  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  function getNavigationMode(params: URLSearchParams) {
    return params.get("category") || params.get("search") ? "listing" : "discover";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isPending) return;
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    const href = `${pathname}?${params.toString()}`;
    beginResourcesNavigation(getNavigationMode(params), href);
    startTransition(() => {
      router.push(href);
    });
  }

  function handleClear() {
    if (isPending) return;
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    const href = `${pathname}?${params.toString()}`;
    beginResourcesNavigation(getNavigationMode(params), href);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full"
      aria-busy={isPending}
    >
      <SearchInput
        variant={variant === "hero" ? "hero" : "default"}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        onClear={handleClear}
        disabled={isPending}
        startAdornment={
          variant === "listing" ? (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-[44px] items-center justify-center text-[#94a3b8]">
              <Search className="h-[14px] w-[14px] stroke-[1.75]" aria-hidden />
            </span>
          ) : undefined
        }
        className={cn(
          variant === "listing" &&
            "h-[40px] rounded-[999px] border-[#e2e8f0] bg-white py-[8px] pl-[45px] pr-[45px] text-[16px] font-normal leading-normal tracking-[0px] text-text-primary shadow-none placeholder:text-[#94a3b8] focus:border-primary-500 focus:ring-2 focus:ring-primary-500/15 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/15",
          className,
        )}
      />
    </form>
  );
}
