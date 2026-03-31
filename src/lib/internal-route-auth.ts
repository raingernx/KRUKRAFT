import { timingSafeEqual } from "crypto";

function constantTimeEquals(actual: string | null, expected: string): boolean {
  if (actual === null) {
    return false;
  }

  const actualBuffer = Buffer.from(actual);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function hasValidInternalRouteSecret(
  request: Request,
  secret: string,
): boolean {
  const bearer = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-warm-secret");

  return (
    constantTimeEquals(bearer, `Bearer ${secret}`) ||
    constantTimeEquals(headerSecret, secret)
  );
}
