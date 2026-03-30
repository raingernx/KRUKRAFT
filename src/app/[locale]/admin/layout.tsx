import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { requireAdminSession } from "@/lib/auth/require-admin-session";
import { routes } from "@/lib/routes";

interface LayoutProps {
  children: ReactNode;
}

export default async function AdminLayoutRoute({ children }: LayoutProps) {
  await requireAdminSession(routes.admin);
  return <AdminLayout>{children}</AdminLayout>;
}
