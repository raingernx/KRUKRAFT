import { LoadingSkeleton } from "@/design-system";

export function ResourcesHeroStageSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/15 bg-[rgba(15,23,42,0.08)] p-4 shadow-none sm:p-5 lg:rounded-[32px] lg:p-6">
      <div className="flex min-h-[232px] items-center justify-center rounded-[22px] border border-dashed border-white/15 bg-[rgba(15,23,42,0.08)] sm:min-h-[252px] lg:min-h-[280px]">
        <LoadingSkeleton className="h-10 w-40 rounded-full bg-white/15" />
      </div>
    </div>
  );
}
