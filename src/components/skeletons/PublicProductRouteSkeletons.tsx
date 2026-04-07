"use client";

import { NavbarShell } from "@/components/layout/NavbarShell";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import {
  Container,
  PageContainer,
  PageContent,
  PageContentNarrow,
} from "@/design-system";

function ListingHeaderSearchSkeleton() {
  return (
    <div className="hidden min-w-0 flex-1 lg:flex">
      <LoadingSkeleton className="h-10 w-full max-w-[560px] rounded-xl" />
    </div>
  );
}

function LegalSectionSkeleton() {
  return (
    <section className="space-y-3">
      <LoadingSkeleton className="h-5 w-40" />
      <LoadingSkeleton className="h-4 w-full" />
      <LoadingSkeleton className="h-4 w-[92%]" />
      <LoadingSkeleton className="h-4 w-[80%]" />
    </section>
  );
}

export function LegalDocumentLoadingShell({
  titleWidth = "w-56",
}: {
  titleWidth?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />
      <Container className="py-16">
        <div className="mx-auto max-w-2xl">
          <LoadingSkeleton className={`h-10 rounded-2xl ${titleWidth}`} />
          <LoadingSkeleton className="mt-2 h-4 w-32" />

          <div className="mt-10 space-y-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <LegalSectionSkeleton key={index} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export function SupportPageLoadingShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavbarShell
        hasMarketplaceShell
        headerSearch={<ListingHeaderSearchSkeleton />}
      />

      <main className="flex-1">
        <Container className="py-12 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-3xl space-y-8">
            <LoadingSkeleton className="h-4 w-40" />

            <section className="rounded-[32px] border border-border bg-card p-8 shadow-card sm:p-10">
              <div className="space-y-4">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-12 w-80 rounded-2xl" />
                <LoadingSkeleton className="h-4 w-full max-w-2xl" />
                <LoadingSkeleton className="h-4 w-[90%] max-w-2xl" />
              </div>

              <div className="mt-8 rounded-3xl border border-border bg-muted p-6">
                <LoadingSkeleton className="h-3 w-24" />
                <LoadingSkeleton className="mt-3 h-6 w-56 rounded-xl" />
                <div className="mt-4 space-y-2">
                  <LoadingSkeleton className="h-4 w-full" />
                  <LoadingSkeleton className="h-4 w-[88%]" />
                  <LoadingSkeleton className="h-4 w-[76%]" />
                </div>
              </div>
            </section>
          </div>
        </Container>
      </main>
    </div>
  );
}

export function MembershipPageLoadingShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavbarShell
        hasMarketplaceShell
        headerSearch={<ListingHeaderSearchSkeleton />}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 py-20 text-center sm:py-24">
        <PageContainer>
          <PageContentNarrow className="space-y-6">
            <div className="space-y-3">
              <LoadingSkeleton className="mx-auto h-3 w-24 bg-white/15" />
              <LoadingSkeleton className="mx-auto h-12 w-80 rounded-2xl bg-white/20" />
              <LoadingSkeleton className="mx-auto h-5 w-full max-w-2xl bg-white/15" />
              <LoadingSkeleton className="mx-auto h-5 w-[80%] max-w-xl bg-white/15" />
            </div>

            <div className="flex justify-center">
              <LoadingSkeleton className="h-8 w-56 rounded-full bg-white/20" />
            </div>

            <div className="mx-auto inline-flex items-center gap-3 rounded-xl bg-white/10 p-1">
              <LoadingSkeleton className="h-10 w-28 rounded-lg bg-white/20" />
              <LoadingSkeleton className="h-10 w-36 rounded-lg bg-white/20" />
            </div>
          </PageContentNarrow>
        </PageContainer>
      </section>

      <section className="relative -mt-8 pb-20">
        <PageContainer>
          <PageContent className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-border bg-card p-6 shadow-card"
              >
                <LoadingSkeleton className="h-5 w-20" />
                <LoadingSkeleton className="mt-4 h-10 w-32 rounded-2xl" />
                <LoadingSkeleton className="mt-3 h-4 w-full" />
                <div className="mt-6 space-y-3">
                  {Array.from({ length: 5 }).map((__, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-3">
                      <LoadingSkeleton className="h-5 w-5 rounded-full" />
                      <LoadingSkeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
                <LoadingSkeleton className="mt-8 h-12 w-full rounded-xl" />
              </div>
            ))}
          </PageContent>
        </PageContainer>
      </section>

      <section className="bg-background py-16">
        <PageContainer>
          <PageContent className="space-y-8">
            <div className="text-center">
              <LoadingSkeleton className="mx-auto h-3 w-24" />
              <LoadingSkeleton className="mx-auto mt-3 h-9 w-52 rounded-2xl" />
              <LoadingSkeleton className="mx-auto mt-2 h-4 w-full max-w-2xl" />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="grid grid-cols-4 gap-4 border-b border-border bg-muted/50 px-4 py-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <LoadingSkeleton key={index} className="h-4 w-20" />
                ))}
              </div>
              <div className="divide-y divide-border">
                {Array.from({ length: 6 }).map((_, rowIndex) => (
                  <div key={rowIndex} className="grid grid-cols-4 gap-4 px-4 py-4">
                    {Array.from({ length: 4 }).map((__, colIndex) => (
                      <LoadingSkeleton
                        key={colIndex}
                        className={colIndex === 0 ? "h-4 w-40" : "h-4 w-20"}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </PageContent>
        </PageContainer>
      </section>
    </div>
  );
}

export function CheckoutStatusPageLoadingShell() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavbarShell />

      <main className="flex flex-1 items-center bg-background">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            <div className="rounded-[28px] border border-border bg-card p-8 shadow-card sm:p-10">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                <LoadingSkeleton className="h-7 w-7 rounded-full" />
              </div>

              <LoadingSkeleton className="mx-auto mt-5 h-8 w-48 rounded-2xl" />
              <div className="mx-auto mt-3 space-y-2">
                <LoadingSkeleton className="h-4 w-full" />
                <LoadingSkeleton className="h-4 w-[86%] mx-auto" />
              </div>

              <div className="my-6 border-t border-border" />

              <div className="flex flex-col gap-3">
                <LoadingSkeleton className="h-12 w-full rounded-xl" />
                <LoadingSkeleton className="h-11 w-full rounded-xl" />
              </div>

              <LoadingSkeleton className="mx-auto mt-5 h-4 w-56" />
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
