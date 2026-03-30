import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAdminResourceCreatePageData } from "@/services/admin-operations.service";
import { CreateResourceForm } from "./CreateResourceForm";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Create Resource – Admin",
  description: "Manually create a new marketplace resource.",
};

export default async function AdminNewResourcePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(routes.loginWithNext(routes.adminNewResource));
  }

  if (session.user.role !== "ADMIN") {
    redirect(routes.dashboard);
  }

  const { categories, tags } = await getAdminResourceCreatePageData();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-h2 font-semibold tracking-tight text-text-primary">
            Create Resource
          </h1>
          <p className="mt-1 text-meta text-text-secondary">
            Fill in the details below to add a new resource to the marketplace.
          </p>
        </div>
      </div>

      <CreateResourceForm
        categories={categories}
        tags={tags}
        currentUser={
          session.user?.id
            ? { id: session.user.id, name: session.user.name ?? null }
            : undefined
        }
      />
    </div>
  );
}
