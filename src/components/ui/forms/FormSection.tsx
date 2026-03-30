"use client";

import {
  FormSection as DSFormSection,
  type FormSectionProps as DSFormSectionProps,
} from "@/design-system";

export type FormSectionProps = DSFormSectionProps;

export function FormSection(props: FormSectionProps) {
  return <DSFormSection {...props} />;
}
