"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  name?: string | null;
  email?: string | null;
  initials?: string;
  size?: number;
  className?: string;
};

const avatarFallbackTextClassNames = {
  24: "text-[10px] leading-3",
  32: "text-xs leading-[14px]",
  40: "text-sm leading-[17px]",
  56: "text-[20px] leading-6",
} satisfies Partial<Record<number, string>>;

function getAvatarInitials({
  name,
  email,
  initials,
}: {
  name?: string | null;
  email?: string | null;
  initials?: string;
}) {
  if (initials?.trim()) {
    return initials.trim().slice(0, 2).toUpperCase();
  }

  const trimmedName = name?.trim();
  if (trimmedName) {
    const parts = trimmedName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }

    return parts[0].slice(0, 2).toUpperCase();
  }

  const emailPrefix = email?.trim().split("@")[0];
  if (emailPrefix) {
    return emailPrefix.slice(0, 2).toUpperCase();
  }

  return "U";
}

function canUseNextImage(src: string) {
  if (src.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(src);
    return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com";
  } catch {
    return false;
  }
}

export function Avatar({
  src,
  alt,
  name,
  email,
  initials,
  size = 32,
  className,
}: AvatarProps) {
  const dimension = { width: size, height: size };
  const normalizedSrc = src?.trim() || null;
  const [broken, setBroken] = React.useState(false);
  const resolvedInitials = React.useMemo(
    () => getAvatarInitials({ name, email, initials }),
    [email, initials, name],
  );
  const imageAlt = alt ?? name ?? email ?? resolvedInitials;
  const fallbackTextClassName =
    avatarFallbackTextClassNames[size as keyof typeof avatarFallbackTextClassNames];

  React.useEffect(() => {
    setBroken(false);
  }, [normalizedSrc]);

  const shellClassName = cn(
    "relative box-border overflow-hidden rounded-full border border-border",
    className,
  );

  if (normalizedSrc && !broken) {
    return (
      <div className={shellClassName} style={dimension}>
        {canUseNextImage(normalizedSrc) ? (
          <Image
            src={normalizedSrc}
            alt={imageAlt}
            fill
            sizes={`${size}px`}
            className="object-cover"
            onError={() => setBroken(true)}
          />
        ) : (
          <img
            src={normalizedSrc}
            alt={imageAlt}
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className={shellClassName} style={dimension}>
      <span
        className={cn(
          "flex h-full w-full items-center justify-center rounded-full bg-primary font-semibold text-on-fill-dark",
          fallbackTextClassName,
        )}
      >
        {resolvedInitials}
      </span>
    </div>
  );
}
