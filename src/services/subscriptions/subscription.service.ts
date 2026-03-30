import {
  findUserMembershipOverview,
  findUserStripeSubscriptionId,
  findUserSubscription,
} from "@/repositories/subscriptions/subscription.repository";
import { stripe } from "@/lib/stripe";

export async function getUserSubscription(userId: string) {
  return findUserSubscription(userId);
}

export async function getUserMembershipOverview(userId: string) {
  return findUserMembershipOverview(userId);
}

export async function cancelUserSubscriptionAtPeriodEnd(userId: string) {
  const user = await findUserStripeSubscriptionId(userId);

  if (!user?.stripeSubscriptionId) {
    return {
      error: "No active subscription found." as const,
      status: 404 as const,
    };
  }

  await stripe.subscriptions.update(user.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });

  return { data: { cancelAtPeriodEnd: true } };
}
