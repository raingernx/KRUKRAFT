import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/design-system";
import { MarketplaceNavbarSearch } from "@/components/marketplace/MarketplaceNavbarSearch";
import { ResourcesRouteReady } from "@/components/marketplace/ResourcesRouteReady";

export function ResourceDetailShell({ children }: { children: ReactNode }) {
  return (
    <div data-route-shell-ready="resource-detail" className="flex min-h-screen flex-col">
      <ResourcesRouteReady />
      <Navbar headerSearch={<MarketplaceNavbarSearch />} />

      <main className="flex-1 bg-background">
        <Container className="py-8 sm:py-10 lg:py-12">{children}</Container>
      </main>
    </div>
  );
}
