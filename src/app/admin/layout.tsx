import type { ReactNode } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";

export const dynamic = "force-dynamic";

interface LayoutProps {
  children: ReactNode;
}

export default function AdminLayoutRoute({ children }: LayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
