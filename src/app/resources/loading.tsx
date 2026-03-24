import { Suspense } from "react";
import { ResourcesLoadingState } from "./ResourcesLoadingState";

export default function Loading() {
  return (
    <Suspense fallback={null}>
      <ResourcesLoadingState heroConfig={undefined} />
    </Suspense>
  );
}
