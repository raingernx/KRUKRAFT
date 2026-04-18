import {
  DashboardPurchasesRouteFrame,
  DashboardPurchasesSectionsSkeleton,
} from "@/components/dashboard/DashboardSections";

export default function DashboardPurchasesLoading() {
  return (
    <DashboardPurchasesRouteFrame>
      <DashboardPurchasesSectionsSkeleton />
    </DashboardPurchasesRouteFrame>
  );
}
