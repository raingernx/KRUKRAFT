"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/design-system";
import { routes } from "@/lib/routes";

interface AdminResourcesClearButtonProps {
  hasFilters: boolean;
  onClear?: () => void;
}

export function AdminResourcesClearButton({
  hasFilters,
  onClear,
}: AdminResourcesClearButtonProps) {
  const router = useRouter();

  if (!hasFilters) return null;

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => {
        router.push(routes.adminResources);
        router.refresh();
        onClear?.();
      }}
    >
      Clear
    </Button>
  );
}
