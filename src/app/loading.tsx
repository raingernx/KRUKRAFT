import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { NavbarBrand } from "@/components/layout/NavbarBrand";
import { Container } from "@/design-system";

function AppRootLoadingShell() {
  return (
    <div
      data-app-root-loading="true"
      className="flex min-h-screen items-center justify-center bg-background px-6 py-16"
    >
      <Container className="max-w-xl">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-11 items-center justify-center">
            <NavbarBrand />
          </div>

          <div className="mt-8 w-full rounded-3xl border border-border bg-card/70 p-8 shadow-card">
            <div className="mx-auto max-w-sm space-y-4">
              <LoadingSkeleton className="mx-auto h-3 w-20 rounded-full" />
              <LoadingSkeleton className="mx-auto h-8 w-4/5 rounded-2xl" />
              <LoadingSkeleton className="mx-auto h-4 w-full rounded-full" />
              <LoadingSkeleton className="mx-auto h-4 w-3/4 rounded-full" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-border bg-background/40 p-4"
                >
                  <LoadingSkeleton className="h-8 w-8 rounded-xl" />
                  <LoadingSkeleton className="mt-4 h-4 w-full" />
                  <LoadingSkeleton className="mt-2 h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function AppRootLoading() {
  return <AppRootLoadingShell />;
}
