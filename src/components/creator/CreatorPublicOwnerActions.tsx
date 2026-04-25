"use client";

import Link from "next/link";

import { Button } from "@/design-system";
import { useAuthViewer } from "@/lib/auth/use-auth-viewer";

export function CreatorPublicOwnerActions({
  creatorUserId,
  editHref,
}: {
  creatorUserId: string;
  editHref: string;
}) {
  const viewer = useAuthViewer();

  if (!viewer.isReady || !viewer.authenticated || !viewer.user) {
    return null;
  }

  const canEdit =
    viewer.user.id === creatorUserId || viewer.user.role === "ADMIN";

  if (!canEdit) {
    return null;
  }

  return (
    <Button asChild size="md" variant="quiet">
      <Link href={editHref}>Edit profile</Link>
    </Button>
  );
}
