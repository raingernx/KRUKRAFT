import {
  DashboardPurchasesRouteFrame,
  DashboardPurchasesSectionsSkeleton,
} from "@/components/dashboard/routes/DashboardPurchasesRoute";

export default function DashboardPurchasesLoading() {
  return (
    <DashboardPurchasesRouteFrame>
      <DashboardPurchasesSectionsSkeleton />
    </DashboardPurchasesRouteFrame>
  );
}
