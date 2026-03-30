"use server";

import { revalidatePath } from "next/cache";
import { assertAdminAction } from "@/lib/auth/assert-admin-action";
import { routes } from "@/lib/routes";
import {
  createAdminTag,
  deleteAdminTag,
  updateAdminTag,
} from "@/services/admin-operations.service";

// ── Actions ───────────────────────────────────────────────────────────────────

export type ActionResult = { error?: string };

export async function createTag(name: string): Promise<ActionResult> {
  await assertAdminAction();
  const result = await createAdminTag(name);

  revalidatePath(routes.adminTags);
  return result;
}

export async function updateTag(
  id: string,
  name: string
): Promise<ActionResult> {
  await assertAdminAction();
  const result = await updateAdminTag({ id, name });

  revalidatePath(routes.adminTags);
  return result;
}

export async function deleteTag(id: string): Promise<ActionResult> {
  await assertAdminAction();
  const result = await deleteAdminTag(id);

  revalidatePath(routes.adminTags);
  return result;
}
