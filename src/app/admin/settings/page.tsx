import { AdminSettingsClient } from "./AdminSettingsClient";
import { getPlatformAdminSettings } from "@/services/platform.service";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const platform = await getPlatformAdminSettings();

  return (
    <AdminSettingsClient
      initialPlatformSettings={platform.resolved}
      initialStoredSettings={platform.stored}
    />
  );
}
