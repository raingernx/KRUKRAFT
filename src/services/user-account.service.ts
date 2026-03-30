import bcrypt from "bcryptjs";
import { logActivity } from "@/lib/activity";
import {
  createRegisteredUser,
  findUserByEmail,
  updateUserProfileById,
} from "@/repositories/users/user.repository";

export async function updateOwnUserProfile(input: {
  userId: string;
  name?: unknown;
  email?: unknown;
}) {
  const updates: { name?: string | null; email?: string | null } = {};

  if (typeof input.name === "string") {
    updates.name = input.name.trim().slice(0, 120);
  }

  if (typeof input.email === "string") {
    const trimmed = input.email.trim();
    updates.email = trimmed.length > 0 ? trimmed.slice(0, 190) : null;
  }

  if (!Object.keys(updates).length) {
    return { error: "No valid fields to update" as const, status: 400 as const };
  }

  const data = await updateUserProfileById({
    userId: input.userId,
    ...updates,
  });

  return { data };
}

export async function registerCredentialUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    return {
      error: "An account with that email already exists." as const,
      status: 409 as const,
    };
  }

  const hashedPassword = await bcrypt.hash(input.password, 12);

  const user = await createRegisteredUser({
    name: input.name,
    email: input.email,
    hashedPassword,
  });

  void logActivity({
    userId: user.id,
    action: "USER_SIGNUP",
    entity: "User",
    entityId: user.id,
    metadata: { email: input.email },
  }).catch(() => {});

  return { data: user };
}
