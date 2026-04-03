/**
 * Purpose: Isolate the authenticated admin resources route under load.
 * Run: BASE_URL=https://krukraft.com SESSION_TOKEN=... k6 run k6/routes/admin-resources.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { buildSessionCookieHeader, requireSessionToken } from '../lib/auth.js';

const BASE_URL = __ENV.BASE_URL || 'https://krukraft.com';
const ROUTE_TAG = 'admin_resources';
const SESSION_TOKEN = requireSessionToken('admin-resources.js');
const COOKIE_HEADER = buildSessionCookieHeader(SESSION_TOKEN);

export const options = {
  scenarios: {
    admin_resources: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 3 },
        { duration: '2m', target: 8 },
        { duration: '2m', target: 15 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<3000'],
    http_req_waiting: ['p(95)<2200'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/admin/resources`, {
    headers: {
      Cookie: COOKIE_HEADER,
    },
    tags: { route: ROUTE_TAG },
  });

  check(response, {
    'admin resources returns 200': (res) => res.status === 200,
    'admin resources waiting under 2200ms': (res) => res.timings.waiting < 2200,
  });

  sleep(1);
}
