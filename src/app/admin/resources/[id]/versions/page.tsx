import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/design-system";
import { getAdminResourceVersionsPageData } from "@/services/admin-operations.service";
import { ResourceVersionsClient } from "./ResourceVersionsClient";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export const metadata = {
  title: "Resource Versions – Admin",
};

export default async function ResourceVersionsPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(routes.loginWithNext(routes.adminResourceVersions(id)));
  }

  if (session.user.role !== "ADMIN") {
    redirect(routes.dashboard);
  }

  const { resource, versions } = await getAdminResourceVersionsPageData(id);

  if (!resource) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h2 font-semibold tracking-tight text-text-primary">
          Versions
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          View and manage file versions for this resource.
        </p>
      </div>

      <Card>
        <CardHeader className="border-b border-border-subtle">
          <CardTitle>{resource.title}</CardTitle>
          <CardDescription className="flex flex-wrap gap-2 text-sm text-text-secondary">
            <span>Slug: {resource.slug}</span>
            <span className="text-border-subtle">•</span>
            <span>Status: {resource.status}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0 pt-0">
          <ResourceVersionsClient
            resourceId={resource.id}
            initialVersions={versions}
          />
        </CardContent>
      </Card>
    </div>
  );
}
