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
      wrapperClass: "bg-success-50 text-success-600",
    },
    info: {
      Icon: Info,
      wrapperClass: "bg-info-50 text-info-600",
    },
    warning: {
      Icon: AlertTriangle,
      wrapperClass: "bg-warning-50 text-warning-600",
    },
    error: {
      Icon: AlertCircle,
      wrapperClass: "bg-danger-50 text-danger-600",
    },
  };

  const Icon = iconConfig[type].Icon;

  return (
    <div className="pointer-events-auto flex w-[min(325px,calc(100vw-3rem))] animate-fade-up items-start gap-3 rounded-sm border border-border bg-card p-3 motion-reduce:animate-none">
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
            <p className="text-h3 text-foreground">
              {message}
            </p>
            {description && (
              <p className="text-small text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {hasAction && actionLabel && onAction && (
            <button
              type="button"
              onClick={() => {
                onAction();
                onDismiss(id);
              }}
              className="shrink-0 font-ui text-caption font-medium text-primary hover:underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
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
