import { Prisma } from "@prisma/client";

/**
 * Returns true when a Prisma error is caused by the underlying table not
 * existing in the database — i.e. the deployed schema is behind the Prisma
 * schema (pending migration).
 *
 * P2021 — model-based query on a missing table
 * P2010 — raw query failed because a Postgres relation does not exist
 *
 * Callers MUST re-throw everything else so unrelated database errors are
 * never silently swallowed.
 *
 * NOTE: PrismaClientInitializationError (connection refused, access denied,
 * wrong credentials) is intentionally NOT caught here. Those errors must
 * surface so misconfigured DATABASE_URL is immediately visible.
 */
export function isMissingTableError(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === "P2021") return true;
  if (error.code === "P2010") {
    return error.message.includes("does not exist");
  }
  return false;
}
