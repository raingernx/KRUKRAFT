import Link from "next/link";
import { CheckCircle, BookOpen, Download, Library } from "@/lib/icons";
import { Navbar } from "@/components/layout/Navbar";
import { Button, Container } from "@/design-system";
import { CheckoutSuccessTracker } from "@/components/checkout/CheckoutSuccessTracker";
import { routes } from "@/lib/routes";

/**
 * /checkout/success
 *
 * Purely informational landing page shown after a provider redirects the buyer
 * back to the platform following a payment attempt.
 *
 * IMPORTANT: This page does NOT create, update, or complete any purchase
 * records. Purchase completion happens exclusively via the provider's webhook.
 * The buyer's library will reflect the purchase once the webhook is processed —
 * typically within a few seconds.
 */

type Props = {
  searchParams: Promise<{ slug?: string }>;
};

export const metadata = {
  title: "Payment received",
};

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <CheckoutSuccessTracker slug={slug} />
      <Navbar />

      <main className="flex flex-1 items-center bg-background">
        <Container className="py-16 sm:py-24">
          <div className="mx-auto max-w-md">
            <div className="rounded-[28px] border border-emerald-200 bg-card p-8 shadow-card sm:p-10">
              {/* Icon */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                <CheckCircle className="h-7 w-7 text-emerald-500" />
              </div>

              {/* Heading */}
              <h1 className="mt-5 text-center font-display text-xl font-semibold tracking-tight text-foreground">
                You&apos;re all set!
              </h1>

              {/* Body */}
              <p className="mx-auto mt-3 max-w-sm text-center text-sm leading-6 text-muted-foreground">
                {slug
                  ? "Head back to the resource — your download will be ready in a few seconds."
                  : "Your purchase is confirmed. Head to your library — it's ready within a few seconds."}
              </p>

              {/* Urgency nudge */}
              <p className="mt-2 text-center text-[13px] font-medium text-emerald-600">
                Start using it now while it&apos;s fresh ✓
              </p>

              {/* Divider */}
              <div className="my-6 border-t border-border" />

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                {slug ? (
                  <>
                    {/*
                      Primary: send the buyer back to the resource page with
                      ?payment=success so the PendingPurchasePoller activates.
                      Once the webhook processes, the page automatically shows
                      the Download button — no library navigation required.
                    */}
                    <Button
                      asChild
                      size="lg"
                      fullWidth
                    >
                      <Link href={routes.resourcePaymentSuccess(slug)}>
                        <Download className="h-4 w-4" />
                        Go back &amp; download
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="quiet"
                      fullWidth
                    >
                      <Link href={routes.dashboardLibrary}>
                        <Library className="h-4 w-4" />
                        View my library
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Fallback when no slug — e.g. Xendit flows that drop slug.
                        ?payment=success activates the recovery block on the
                        library page so the buyer can find their purchase. */}
                    <Button
                      asChild
                      size="lg"
                      fullWidth
                    >
                      <Link href={routes.dashboardLibraryPaymentSuccess()}>
                        <Library className="h-4 w-4" />
                        Go to My Library
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="quiet"
                      fullWidth
                    >
                      <Link href={routes.marketplace}>
                        <BookOpen className="h-4 w-4" />
                        Browse more resources
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Reassurance */}
              <p className="mt-5 text-center text-[12px] text-muted-foreground">
                If your library doesn&apos;t update within a minute,{" "}
                <Link
                  href={routes.support}
                  className="underline underline-offset-2 transition hover:text-foreground"
                >
                  contact support
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
