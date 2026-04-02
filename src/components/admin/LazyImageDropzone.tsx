"use client";

import dynamic from "next/dynamic";
import { ImagePlus } from "lucide-react";

import { PickerDropzoneShell } from "@/design-system";
import type { ImageDropzoneProps } from "@/components/admin/ImageDropzone";

const DynamicImageDropzone = dynamic(
  () =>
    import("@/components/admin/ImageDropzone").then((mod) => mod.ImageDropzone),
  {
    ssr: false,
    loading: () => <ImageDropzoneLoadingShell />,
  },
);

function ImageDropzoneLoadingShell() {
  return (
    <div className="w-full min-w-0 space-y-1.5">
      <PickerDropzoneShell
        disabled
        className="border-border-subtle bg-white"
        aria-busy="true"
      >
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-surface-100 text-brand-600">
          <ImagePlus className="h-5 w-5" />
        </div>
        <p className="font-medium text-text-primary">Preparing image upload…</p>
        <p className="mt-1 text-[11px] text-text-secondary">
          The uploader loads separately to keep this form lighter on first render.
        </p>
      </PickerDropzoneShell>
    </div>
  );
}

export function LazyImageDropzone(props: ImageDropzoneProps) {
  return <DynamicImageDropzone {...props} />;
}
