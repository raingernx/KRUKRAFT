/**
 * Purpose: Lightweight CI smoke check for the hot public creator route.
 * Run: BASE_URL=https://krucrafts.com HOT_CREATOR=kru-mint k6 run k6/routes/creator-detail-smoke.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'https://krucrafts.com';
const HOT_CREATOR = __ENV.HOT_CREATOR || 'kru-mint';
const ROUTE_TAG = 'creator_hot';

export const options = {
  scenarios: {
    creator_detail_smoke: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '5s', target: 1 },
        { duration: '10s', target: 3 },
        { duration: '10s', target: 5 },
        { duration: '5s', target: 0 },
      ],
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const response = http.get(`${BASE_URL}/creators/${HOT_CREATOR}`, {
    tags: { route: ROUTE_TAG },
  });

  check(response, {
    'creator detail smoke returns 200': (res) => res.status === 200,
  });

  sleep(1);
}
