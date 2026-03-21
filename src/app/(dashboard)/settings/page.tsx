import { authOptions } from "@/lib/auth";
import { requireSession } from "@/lib/auth/require-session";
import { prisma } from "@/lib/prisma";
import { getUserPreferences } from "@/lib/preferences";
import { PageContentNarrow } from "@/design-system";
import { SettingsTabs } from "@/components/settings/SettingsTabs";

export const metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await requireSession("/settings");

  const [user, preferences] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, image: true, createdAt: true },
    }),
    getUserPreferences(userId),
  ]);

  return (
    <PageContentNarrow className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-display text-h2 font-semibold tracking-tight text-zinc-900">
          Settings
        </h1>
        <p className="text-[14px] text-zinc-500">
          Manage your account preferences and security.
        </p>
      </div>

      <SettingsTabs
        user={{
          name: user?.name ?? null,
          email: user?.email ?? null,
          image: user?.image ?? null,
        }}
        preferences={preferences}
      />
    </PageContentNarrow>
  );
}
