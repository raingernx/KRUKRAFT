import Link from "next/link";
import { XCircle, BookOpen, ArrowLeft, RotateCcw } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/design-system";
import { routes } from "@/lib/routes";

/**
 * /checkout/cancel
 *
 * Purely informational landing page shown when a buyer cancels or abandons
 * the provider's hosted checkout page, or when a payment fails.
 *
 * IMPORTANT: This page does NOT modify any purchase records. The PENDING
 * purchase record created at session initiation remains in the database for
 * potential recovery but does NOT grant any access.
 */

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export const metadata = {
  title: "Payment not completed",
};

export default async function CheckoutCancelPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center bg-zinc-50">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            <div className="rounded-[28px] border border-surface-200 bg-white p-8 shadow-card sm:p-10">
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-50">
                <XCircle className="h-7 w-7 text-zinc-400" />
              </div>

              {/* Heading */}
              <h1 className="mt-5 text-center font-display text-xl font-semibold tracking-tight text-zinc-900">
                No worries — nothing was charged
              </h1>

              {/* Body */}
              <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-zinc-500">
                Your payment didn&apos;t complete. You haven&apos;t been
                charged — the resource is still here whenever you&apos;re ready.
              </p>

              {/* Divider */}
              <div className="my-6 border-t border-surface-200" />

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                {slug ? (
                  <>
                    <Link
                      href={routes.resource(slug)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Try again
                    </Link>
                    <p className="text-center text-[11px] text-zinc-400">
                      Takes you back to the same resource — pick up where you left off
                    </p>
                    <Link
                      href={routes.marketplace}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-surface-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-surface-50"
                    >
                      <BookOpen className="h-4 w-4" />
                      Browse all resources
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={routes.marketplace}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-700"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to resources
                    </Link>
                    <p className="text-center text-[11px] text-zinc-400">
                      Browse and pick up where you left off
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
