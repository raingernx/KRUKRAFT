import { getCachedServerSession } from "@/lib/auth";

export async function assertAdminAction() {
  const session = await getCachedServerSession();

  if (!session?.user?.id) {
    throw new Error("Unauthenticated");
  }

  if (session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  return session;
}
