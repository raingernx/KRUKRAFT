import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { routes } from "@/lib/routes";
import { ActivityLogClient } from "./ActivityLogClient";

export const metadata = {
  title: "Activity – Admin",
  description: "View recent admin activity.",
};

export default async function AdminActivityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(routes.loginWithNext(routes.adminActivity));
  }

  if (session.user.role !== "ADMIN") {
    redirect(routes.dashboard);
  }

  return <ActivityLogClient />;
}
