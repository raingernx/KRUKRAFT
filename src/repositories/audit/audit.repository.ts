import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export function findAdminAuditLogs(params: {
  where: Prisma.AuditLogWhereInput;
  skip: number;
  take: number;
}) {
  return prisma.auditLog.findMany({
    where: params.where,
    include: {
      admin: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: params.skip,
    take: params.take,
  });
}

export function countAdminAuditLogs(where: Prisma.AuditLogWhereInput) {
  return prisma.auditLog.count({ where });
}

export function findDistinctAdminAuditActions() {
  return prisma.auditLog.findMany({
    select: { action: true },
    distinct: ["action"],
    orderBy: { action: "asc" },
  });
}

export function findRecentAdminActivityLogs(take = 50) {
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take,
  });
}
