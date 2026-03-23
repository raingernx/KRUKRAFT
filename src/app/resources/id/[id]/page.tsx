import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resource = await prisma.resource.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!resource) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const payment =
    typeof resolvedSearchParams?.payment === "string"
      ? resolvedSearchParams.payment
      : undefined;
  const query = payment ? `?payment=${encodeURIComponent(payment)}` : "";

  redirect(`/resources/${resource.slug}${query}`);
}
