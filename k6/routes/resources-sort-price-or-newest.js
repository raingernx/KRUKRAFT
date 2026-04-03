/**
 * Purpose: Isolate the marketplace sorted listing path under load.
 * Run: BASE_URL=https://krukraft.com SORT=newest k6 run k6/routes/resources-sort-price-or-newest.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://krukraft.com';
const SORT = __ENV.SORT || 'newest';
const ROUTE_TAG = 'resources_sort';

export const options = {
  scenarios: {
    resources_sort: {
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
    `${BASE_URL}/resources?sort=${encodeURIComponent(SORT)}`,
    {
      tags: { route: ROUTE_TAG },
    },
  );

  check(response, {
    'resources sort returns 200': (res) => res.status === 200,
    'resources sort waiting under 1600ms': (res) => res.timings.waiting < 1600,
  });

  sleep(1);
}
