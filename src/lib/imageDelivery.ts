/**
 * Public preview media is already hosted on a CDN/public bucket and does not
 * benefit much from going through Next's optimizer hop again. Keep local
 * assets on the normal Next.js path, and only bypass optimization for sources
 * that Next Image cannot safely optimize in this repo configuration.
 */
const OPTIMIZER_ALLOWED_REMOTE_HOSTS = new Set([
  "lh3.googleusercontent.com",
]);

function isOptimizerAllowedRemoteHost(hostname: string) {
  return (
    OPTIMIZER_ALLOWED_REMOTE_HOSTS.has(hostname) ||
    hostname.endsWith(".r2.dev")
  );
}

export function shouldBypassImageOptimizer(src?: string | null) {
  if (!src) {
    return false;
  }

  if (src.startsWith("/")) {
    return false;
  }

  try {
    const url = new URL(src);
    const isGif = url.pathname.toLowerCase().endsWith(".gif");

    if (url.protocol !== "https:") {
      return true;
    }

    if (isGif) {
      return true;
    }

    return !isOptimizerAllowedRemoteHost(url.hostname);
  } catch {
    return false;
  }
}
