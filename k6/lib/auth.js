import { fail } from 'k6';

const DEFAULT_COOKIE_NAME = __ENV.COOKIE_NAME || '__Secure-authjs.session-token';

export function requireSessionToken(scriptName) {
  const token = __ENV.SESSION_TOKEN;

  if (!token) {
    fail(
      `${scriptName} requires SESSION_TOKEN. Set SESSION_TOKEN and optionally COOKIE_NAME before running this authenticated benchmark.`,
    );
  }

  return token;
}

export function buildSessionCookieHeader(sessionToken) {
  return `${DEFAULT_COOKIE_NAME}=${sessionToken}`;
}
