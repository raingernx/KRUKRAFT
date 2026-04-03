"use client";

import type { ComponentProps } from "react";

import { FileUploadWidget as UIFileUploadWidget } from "@/components/admin/FileUploadWidget";

export type FileUploadWidgetProps = ComponentProps<typeof UIFileUploadWidget>;

function FileUploadWidget(props: FileUploadWidgetProps) {
  return <UIFileUploadWidget {...props} />;
}

export { FileUploadWidget };
