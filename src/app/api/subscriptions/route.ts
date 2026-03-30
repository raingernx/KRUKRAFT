import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  cancelUserSubscriptionAtPeriodEnd,
  getUserSubscription,
} from "@/services/subscriptions/subscription.service";

// GET /api/subscriptions  –  returns the current user's subscription status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await getUserSubscription(session.user.id);

    return NextResponse.json({ data: user });
  } catch (err) {
    console.error("[SUBSCRIPTIONS_GET]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// DELETE /api/subscriptions  –  cancel the current user's subscription at period end
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const result = await cancelUserSubscriptionAtPeriodEnd(session.user.id);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[SUBSCRIPTIONS_DELETE]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
