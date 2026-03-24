/**
 * Purpose: Isolate the marketplace search listing path under load.
 * Run: BASE_URL=https://krucrafts.com QUERY=science k6 run k6/routes/resources-search.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://krucrafts.com';
const QUERY = __ENV.QUERY || 'science';
const ROUTE_TAG = 'resources_search';

export const options = {
  scenarios: {
    resources_search: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '1m', target: 10 },
        { duration: '2m', target: 25 },
        { duration: '2m', target: 50 },
        { duration: '1m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2200'],
    http_req_waiting: ['p(95)<1600'],
  },
};

export default function () {
  const response = http.get(
    `${BASE_URL}/resources?q=${encodeURIComponent(QUERY)}&search=${encodeURIComponent(QUERY)}`,
    {
      tags: { route: ROUTE_TAG },
    },
  );

  check(response, {
    'resources search returns 200': (res) => res.status === 200,
    'resources search waiting under 1600ms': (res) => res.timings.waiting < 1600,
  });

  sleep(1);
}
