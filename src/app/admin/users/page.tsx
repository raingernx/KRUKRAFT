import { Suspense } from "react";
import { Search } from "@/lib/icons";
import { Input, Button, RowActionButton, RowActions } from "@/design-system";
import { formatNumber, formatDate } from "@/lib/format";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHeadCell,
  DataTableHeader,
  DataTableRow,
  TableEmptyState,
  TableToolbar,
} from "@/components/admin/table";
import { getAdminUsersPageData } from "@/services/admin";
import {
  traceServerStep,
  withRequestPerformanceTrace,
} from "@/lib/performance/observability";
import { AdminUsersResultsSkeleton } from "@/components/skeletons/AdminCoreRouteSkeletons";

export const metadata = {
  title: "Users – Admin",
  description: "Manage platform users.",
};

interface AdminUsersPageProps {
  searchParams?: Promise<{ q?: string }>;
}

async function AdminUsersResultsSection({
  dataPromise,
}: {
  dataPromise: ReturnType<typeof getAdminUsersPageData>;
}) {
  const users = await dataPromise;

  return (
    <DataTable minWidth="min-w-[720px]">
      <DataTableHeader>
        <tr>
          <DataTableHeadCell>User</DataTableHeadCell>
          <DataTableHeadCell>Email</DataTableHeadCell>
          <DataTableHeadCell>Role</DataTableHeadCell>
          <DataTableHeadCell>Resources</DataTableHeadCell>
          <DataTableHeadCell>Joined</DataTableHeadCell>
          <DataTableHeadCell align="right">Actions</DataTableHeadCell>
        </tr>
      </DataTableHeader>
      <DataTableBody>
                {users.length === 0 ? (
          <TableEmptyState message="No users found." />
        ) : (
          users.map((user) => (
            <DataTableRow key={user.id}>
              <DataTableCell className="font-medium">{user.name ?? "—"}</DataTableCell>
              <DataTableCell className="text-muted-foreground">
                {user.email ?? "—"}
              </DataTableCell>
              <DataTableCell>
                <StatusBadge
                  status={user.role}
                  label={
                    user.role === "ADMIN"
                      ? "Admin"
                      : user.role === "INSTRUCTOR"
                        ? "Creator"
                        : "User"
                  }
                  tone={
                    user.role === "ADMIN"
                      ? "accent"
                      : user.role === "INSTRUCTOR"
                        ? "info"
                        : "muted"
                  }
                />
              </DataTableCell>
              <DataTableCell className="tabular-nums text-muted-foreground">
                {formatNumber(user._count.resources)}
              </DataTableCell>
              <DataTableCell className="text-muted-foreground">
                {formatDate(user.createdAt)}
              </DataTableCell>
              <DataTableCell align="right">
                <RowActions>
                  <RowActionButton type="button" size="md">
                    View
                  </RowActionButton>
                  <RowActionButton type="button" tone="muted" size="md">
                    Suspend
                  </RowActionButton>
                  <RowActionButton type="button" tone="danger" size="md">
                    Delete
                  </RowActionButton>
                </RowActions>
              </DataTableCell>
            </DataTableRow>
          ))
        )}
      </DataTableBody>
    </DataTable>
  );
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams.q?.trim() ?? "";

  return withRequestPerformanceTrace(
    "route:/admin/users",
    {
      hasQuery: Boolean(query),
    },
    async () => {
      const usersPromise = traceServerStep(
        "admin_users.getAdminUsersPageData",
        () => getAdminUsersPageData({ query }),
        { hasQuery: Boolean(query) },
      );

      return (
        <div className="min-w-0 space-y-7">
          <AdminPageHeader title="Users" description="Manage platform users." />

          <form>
            <TableToolbar className="gap-2.5">
              <div className="flex min-w-[220px] flex-1 flex-col gap-1">
                <label htmlFor="q" className="font-ui text-caption text-muted-foreground">
                  Search
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </span>
                  <Input
                    id="q"
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Search by name or email…"
                    className="pl-9"
                  />
                </div>
              </div>
              <Button type="submit" variant="outline" size="sm" className="self-end">
                Search
              </Button>
            </TableToolbar>
          </form>

          <Suspense fallback={<AdminUsersResultsSkeleton />}>
            <AdminUsersResultsSection dataPromise={usersPromise} />
          </Suspense>
        </div>
      );
    },
  );
}
