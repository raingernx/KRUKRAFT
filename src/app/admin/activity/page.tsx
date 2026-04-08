import { ActivityLogClient } from "./ActivityLogClient";

export const metadata = {
  title: "Activity – Admin",
  description: "View recent admin activity.",
};

export default async function AdminActivityPage() {
  return <ActivityLogClient />;
}
