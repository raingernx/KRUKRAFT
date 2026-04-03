import type { ComponentProps } from "react";

import { SectionHeader as UISectionHeader } from "@/components/ui/SectionHeader";

export type SectionHeaderProps = ComponentProps<typeof UISectionHeader>;

function SectionHeader(props: SectionHeaderProps) {
  return <UISectionHeader {...props} />;
}

export { SectionHeader };
