import type { ComponentProps } from "react";

import { NotificationButton as UINotificationButton } from "@/components/ui/NotificationButton";

export type NotificationButtonProps = ComponentProps<typeof UINotificationButton>;

function NotificationButton(props: NotificationButtonProps) {
  return <UINotificationButton {...props} />;
}

export { NotificationButton };
