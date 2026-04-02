"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type RevealImageProps = ImageProps & {
  overlayClassName?: string;
};

/**
 * Stable image primitive for already-sized containers.
 * The surrounding container should own the placeholder background so the image
 * can load naturally without JS-driven reveal state getting stuck.
 */
export function RevealImage({
  className,
  overlayClassName: _overlayClassName,
  onError,
  src,
  ...props
}: RevealImageProps) {
  const [hasError, setHasError] = useState(false);
  const wrapperClassName = props.fill ? "absolute inset-0 block" : "contents";

  if (hasError) {
    return null;
  }

  return (
    <span className={wrapperClassName}>
      <Image
        {...props}
        src={src}
        className={cn(
          "opacity-100 transition-opacity duration-300 motion-reduce:transition-none",
          className,
        )}
        onError={(event) => {
          setHasError(true);
          onError?.(event);
        }}
      />
    </span>
  );
}
