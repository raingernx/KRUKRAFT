"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Card } from "@/design-system";
import { ResourceCard } from "@/design-system/product";
import {
  AdminFormLayout,
  AdminResourceFormLoadingShell,
} from "@/components/admin/resources";
import type { ResourceCardData } from "@/design-system/product";
import type {
  ResourceFormCategory,
  ResourceFormTag,
  ResourcePayload,
  ResourceFormResource,
} from "@/components/admin/resources";

const ResourceForm = dynamic(() =>
  import("@/components/admin/resources").then((m) => m.ResourceForm),
  {
    loading: () => <AdminResourceFormLoadingShell />,
  },
);

interface CreateResourceFormProps {
  categories: ResourceFormCategory[];
  tags: ResourceFormTag[];
  currentUser?: { id: string; name: string | null };
}

const defaultPreviewData: ResourceCardData = {
  id: "preview",
  title: "Sample resource title",
  slug: "sample-resource",
  description:
    "Short description of the resource to show how it will look in the marketplace.",
  isFree: true,
  price: 0,
  previewUrl: null,
  downloadCount: 0,
  author: { name: "You" },
  category: undefined,
  tags: [],
  _count: { purchases: 0, reviews: 0 },
};

export function CreateResourceForm({ categories, tags: initialTags, currentUser }: CreateResourceFormProps) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [previewData, setPreviewData] =
    useState<ResourceCardData>(defaultPreviewData);
  const [draftResourceId, setDraftResourceId] = useState<string | null>(null);
  const draftResourcePromiseRef = useRef<Promise<string | undefined> | null>(null);
  const adminDraftUploadErrorMessage =
    "Could not create a draft resource for upload right now. Please try again.";

  async function ensureDraftResource() {
    if (draftResourceId) return draftResourceId;

    if (draftResourcePromiseRef.current) {
      return draftResourcePromiseRef.current;
    }

    draftResourcePromiseRef.current = (async () => {
      try {
        const res = await fetch("/api/admin/resources/draft", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          console.warn("Failed to create draft resource", data);
          throw new Error(
            typeof data?.error === "string"
              ? data.error
              : adminDraftUploadErrorMessage,
          );
        }

        const draftId = data.id as string | undefined;
        if (!draftId) {
          throw new Error(adminDraftUploadErrorMessage);
        }

        setDraftResourceId(draftId);
        return draftId;
      } catch (err) {
        console.warn("Error creating draft resource", err);
        throw err instanceof Error
          ? err
          : new Error(adminDraftUploadErrorMessage);
      } finally {
        draftResourcePromiseRef.current = null;
      }
    })();

    return draftResourcePromiseRef.current;
  }

  async function handleCreate(payload: ResourcePayload) {
    // When a draft exists, finalize it via PATCH so uploads stay attached.
    if (draftResourceId) {
      const res = await fetch(`/api/admin/resources/${draftResourceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const error = new Error(
          data.error ?? "Failed to create resource.",
        ) as Error & { fields?: Record<string, string> };
        if (data.fields) {
          error.fields = data.fields as Record<string, string>;
        }
        throw error;
      }

      router.refresh();
      return;
    }

    // Fallback: legacy create behavior without draft.
    const res = await fetch("/api/admin/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(
        data.error ?? "Failed to create resource.",
      ) as Error & { fields?: Record<string, string> };
      if (data.fields) {
        error.fields = data.fields as Record<string, string>;
      }
      throw error;
    }

    router.refresh();
  }

  return (
    <AdminFormLayout
      form={
        <Card className="w-full min-w-0 rounded-2xl border border-border bg-card px-5 pb-6 pt-4 shadow-card sm:px-6 sm:pb-8 lg:px-8">
          <ResourceForm
            mode="create"
            categories={categories}
            tags={tags}
            draftResourceId={draftResourceId ?? undefined}
            onEnsureDraftResource={ensureDraftResource}
            onSubmit={handleCreate}
            onPreviewDataChange={setPreviewData}
            onTagCreated={(tag) => setTags((prev) => [...prev, tag])}
            currentUser={currentUser}
          />
        </Card>
      }
      sidebar={
        <div className="w-full">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            LIVE PREVIEW
          </p>
          <ResourceCard resource={previewData} variant="preview" previewMode />
        </div>
      }
    />
  );
}
