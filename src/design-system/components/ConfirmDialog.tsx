import type { ComponentProps } from "react";

import {
  ConfirmDialog as UIConfirmDialog,
  type ConfirmDialogProps,
  type ConfirmVariant,
} from "@/components/ui/confirm-dialog";

type UIConfirmDialogProps = ComponentProps<typeof UIConfirmDialog>;

function ConfirmDialog(props: UIConfirmDialogProps) {
  return <UIConfirmDialog {...props} />;
}

export { ConfirmDialog };
export type { ConfirmDialogProps, ConfirmVariant };
