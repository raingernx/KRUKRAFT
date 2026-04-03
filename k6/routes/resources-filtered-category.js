/**
 * Purpose: Isolate the marketplace category-filtered listing path under load.
 * Run: BASE_URL=https://krukraft.com CATEGORY=science k6 run k6/routes/resources-filtered-category.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://krukraft.com';
const CATEGORY = __ENV.CATEGORY || 'science';
const ROUTE_TAG = 'resources_filtered_category';

export const options = {
  scenarios: {
    resources_filtered_category: {
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
    `${BASE_URL}/resources?category=${encodeURIComponent(CATEGORY)}`,
    {
      tags: { route: ROUTE_TAG },
    },
  );

  check(response, {
    'resources filtered category returns 200': (res) => res.status === 200,
    'resources filtered category waiting under 1600ms': (res) => res.timings.waiting < 1600,
  });

  sleep(1);
}
