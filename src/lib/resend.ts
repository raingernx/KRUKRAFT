import { Resend } from "resend";

/**
 * Returns a configured Resend client when RESEND_API_KEY is present in the
 * environment, or null when it is absent.
 *
 * Lazy: the Resend constructor is only called on first use, never at module
 * load time. This prevents a missing key from throwing during import and
 * crashing webhook routes before they can process any events.
 *
 * Memoised: the client (or null sentinel) is cached after the first call so
 * the constructor is never invoked more than once per process lifetime.
 *
 * Previous pattern — `export const resend = new Resend(process.env.RESEND_API_KEY)`
 * — was written when the Resend SDK tolerated a missing key in the constructor.
 * Resend 6.x now throws `Error: Missing API key` eagerly, making that pattern
 * unsafe when RESEND_API_KEY is absent (e.g. local dev without email configured).
 */

// undefined = not yet resolved; null = key absent; Resend = ready
let _client: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (_client !== undefined) return _client;

  const key = process.env.RESEND_API_KEY;

  if (!key) {
    _client = null;
    return null;
  }

  _client = new Resend(key);
  return _client;
}
