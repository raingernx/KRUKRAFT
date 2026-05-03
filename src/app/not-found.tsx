import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button, Container } from "@/design-system";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <Container className="py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            404
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            The page you were looking for does not exist or has been moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href={routes.marketplace}>Browse resources</Link>
            </Button>
            <Button asChild size="lg" variant="quiet">
              <Link href={routes.home}>Go home</Link>
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}
