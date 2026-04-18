import { DashboardSettingsStreamedContent } from "@/components/dashboard/DashboardSections";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getDashboardSettingsData } from "@/services/dashboard/settings.service";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function DashboardSettingsPage() {
  const { userId, session } = await requireSession(routes.dashboardSettings);
  const dataPromise = getDashboardSettingsData({
    userId,
    fallbackUser: {
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
    },
  });

  return <DashboardSettingsStreamedContent dataPromise={dataPromise} />;
}
