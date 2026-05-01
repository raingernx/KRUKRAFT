import { notFound } from "next/navigation";

import { env } from "@/env";

import { DevNotificationsHarnessClient } from "./DevNotificationsHarnessClient";

export const metadata = {
  title: "Dev Notification Harness",
  description: "Non-production notification proof surface for NotificationItem.",
};

export default function DevNotificationsPage() {
  if (env.NODE_ENV === "production") {
    notFound();
  }

  return <DevNotificationsHarnessClient />;
}
