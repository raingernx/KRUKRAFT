/**
 * Purpose: Isolate the authenticated dashboard overview route under load.
 * Run: BASE_URL=https://krucrafts.com SESSION_TOKEN=... k6 run k6/routes/dashboard-overview.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { buildSessionCookieHeader, requireSessionToken } from '../lib/auth.js';

const BASE_URL = __ENV.BASE_URL || 'https://krucrafts.com';
const ROUTE_TAG = 'dashboard_overview';
const SESSION_TOKEN = requireSessionToken('dashboard-overview.js');
const COOKIE_HEADER = buildSessionCookieHeader(SESSION_TOKEN);

export const options = {
  scenarios: {
    dashboard_overview: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 5 },
        { duration: '2m', target: 15 },
        { duration: '2m', target: 30 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500'],
    http_req_waiting: ['p(95)<1800'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/dashboard`, {
    headers: {
      Cookie: COOKIE_HEADER,
    },
    tags: { route: ROUTE_TAG },
  });

  check(response, {
    'dashboard overview returns 200': (res) => res.status === 200,
    'dashboard overview waiting under 1800ms': (res) => res.timings.waiting < 1800,
  });

  sleep(1);
}
