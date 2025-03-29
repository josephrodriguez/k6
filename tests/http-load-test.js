import http from 'k6/http';
import { check } from 'k6';

const httpBaseUrl = __ENV.K6_BASE_URL || 'http://localhost:8080/';

const httpLoadDurationSeconds = parseInt(__ENV.K6_HTTP_LOAD_DURATION_SECONDS || 60, 10);
const httpRampUpDurationSeconds = parseInt(__ENV.K6_HTTP_RAMP_UP_DURATION_SECONDS || 30, 10);
const httpRampDownDurationSeconds = parseInt(__ENV.K6_HTTP_RAMP_DOWN_DURATION_SECONDS || 30, 10);

export let options = {
  stages: [
    { duration: `${httpRampUpDurationSeconds}s`, target: 100 },
    { duration: `${httpLoadDurationSeconds}s`, target: 100 },
    { duration: `${httpRampDownDurationSeconds}s`, target: 0 },
  ]
};

export default function () {
  const response = http.get(httpBaseUrl);

  check(response, {
    'is status 200': (r) => r.status === 200,
  });
}
