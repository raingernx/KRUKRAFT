import { prisma } from "@/lib/prisma";

export async function findUserSubscription(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPlan: true,
      currentPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  });
}

export async function findUserMembershipOverview(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionStatus: true,
      subscriptionPlan: true,
      currentPeriodEnd: true,
      purchases: {
        where: { status: "COMPLETED" },
        select: { id: true },
      },
    },
  });
}

export function findUserStripeSubscriptionId(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { stripeSubscriptionId: true },
  });
}
