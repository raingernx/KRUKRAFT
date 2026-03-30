import { redirect, notFound } from "next/navigation";
import { getPublicResourceSlugRedirectTarget } from "@/services/admin-operations.service";
import { routes } from "@/lib/routes";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resource = await getPublicResourceSlugRedirectTarget(id);

  if (!resource) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const payment =
    typeof resolvedSearchParams?.payment === "string"
      ? resolvedSearchParams.payment
      : undefined;
  const query = payment ? `?payment=${encodeURIComponent(payment)}` : "";

  redirect(`${routes.resource(resource.slug)}${query}`);
}
