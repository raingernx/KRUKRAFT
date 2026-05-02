"use client";
import { CheckCircle2, Info, AlertCircle, AlertTriangle, X } from "@/lib/icons";

import type { Notification, NotificationType } from "@/features/admin-ux/types";

interface NotificationItemProps {
  notification: Notification;
  onDismiss: (id: string) => void;
}

export function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const { id, type, message, description, actionLabel, onAction } = notification;
  const hasAction = Boolean(actionLabel && onAction);
  const contentGapClass = hasAction || type !== "success" ? "gap-1" : "gap-2";

  const iconConfig: Record<
    NotificationType,
    {
      Icon: React.ComponentType<{ className?: string }>;
      wrapperClass: string;
    }
  > = {
    success: {
      Icon: CheckCircle2,
      wrapperClass: "bg-[#D9F4E8] text-[#10B981] dark:bg-[#123D2C] dark:text-[#02B567]",
    },
    info: {
      Icon: Info,
      wrapperClass: "bg-[#EFF6FF] text-[#2563EB] dark:bg-[#172554] dark:text-[#60A5FA]",
    },
    warning: {
      Icon: AlertTriangle,
      wrapperClass: "bg-[#FCE7D8] text-[#F5700B] dark:bg-[#4B2A15] dark:text-[#DF5D05]",
    },
    error: {
      Icon: AlertCircle,
      wrapperClass: "bg-[#FFEFEB] text-[#DB3A1C] dark:bg-[#321B17] dark:text-[#E84729]",
    },
  };

  const Icon = iconConfig[type].Icon;

  return (
    <div className="pointer-events-auto flex w-[min(325px,calc(100vw-3rem))] animate-fade-up items-start gap-3 rounded-[var(--radius-sm)] border border-border bg-card p-3 motion-reduce:animate-none">
      <div
        className={[
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          iconConfig[type].wrapperClass,
        ].join(" ")}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className={["min-w-0 flex-1 flex flex-col", contentGapClass].join(" ")}>
        <div className={["flex w-full items-start", hasAction ? "gap-3" : "gap-0"].join(" ")}>
          <div className="min-w-0 flex-1">
            <p className="text-title-sm text-foreground">{message}</p>
          </div>
          {hasAction && actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction();
                onDismiss(id);
              }}
              className="shrink-0 font-ui text-caption font-semibold text-primary hover:underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
        {description && (
          <p className="text-small text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(id)}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
