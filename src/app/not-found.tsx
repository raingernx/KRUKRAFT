import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/design-system";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <Container className="py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary">
            Page not found
          </h1>
          <p className="mt-3 text-base text-text-secondary">
            The page you were looking for does not exist or has been moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={routes.marketplace}
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Browse resources
            </Link>
            <Link
              href={routes.home}
              className="inline-flex items-center justify-center rounded-xl border border-surface-200 px-5 py-3 text-sm font-medium text-text-secondary transition hover:bg-surface-50"
            >
              Go home
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
