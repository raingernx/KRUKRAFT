import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { Button } from "@/design-system";
import { AdminResourcesTrashTable } from "@/components/admin/AdminResourcesTrashTable";
import { getAdminResourcesTrashPageData } from "@/services/admin-operations.service";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Trash – Admin",
  description: "View and restore resources that have been moved to trash.",
};

const PAGE_SIZE = 50;

export default async function AdminResourcesTrashPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(routes.loginWithNext(routes.adminTrash));
  }

  if (session.user.role !== "ADMIN") {
    redirect(routes.dashboard);
  }

  const rows = await getAdminResourcesTrashPageData({ take: PAGE_SIZE });

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-h2 font-semibold tracking-tight text-text-primary">
            Trash
          </h1>
          <p className="mt-1 text-meta text-text-secondary">
            View resources that have been moved to trash. Restored items will
            reappear in the main resources list.
          </p>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="inline-flex items-center gap-2"
        >
          <Link href={routes.adminResources}>
            <ArrowLeft className="h-4 w-4 text-text-secondary" />
            <span>Back to Resources</span>
          </Link>
        </Button>
      </div>

      <AdminResourcesTrashTable resources={rows} />
    </>
  );
}
