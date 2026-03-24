import { prisma } from "@/lib/prisma";

export async function findCheckoutUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      stripeCustomerId: true,
    },
  });
}

export async function updateUserStripeCustomerId(userId: string, stripeCustomerId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId },
  });
}

export interface ActivateUserStripeSubscriptionInput {
  userId: string;
  stripeSubscriptionId: string;
  subscriptionPlan: string | null;
  currentPeriodEnd: Date;
}

export async function activateUserStripeSubscription(
  input: ActivateUserStripeSubscriptionInput,
) {
  return prisma.user.update({
    where: { id: input.userId },
    data: {
      stripeSubscriptionId: input.stripeSubscriptionId,
      subscriptionStatus: "ACTIVE",
      subscriptionPlan: input.subscriptionPlan,
      currentPeriodEnd: input.currentPeriodEnd,
    },
  });
}

export async function findAdminUsers(params: {
  query?: string;
  take: number;
}) {
  const query = params.query?.trim();

  return prisma.user.findMany({
    take: params.take,
    orderBy: { createdAt: "desc" },
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { resources: true } },
    },
  });
}
