import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

const HOST = __ENV.GRPC_HOST || 'localhost';
const PORT = __ENV.GRPC_PORT || '50051';
const TARGET = `${HOST}:${PORT}`;
const METHOD = __ENV.GRPC_METHOD;

const PAYLOAD = JSON.parse(__ENV.GRPC_PAYLOAD || '{}');

const rampUpDuration = __ENV.RAMP_UP || '10s';
const loadDuration = __ENV.LOAD || '30s';
const rampDownDuration = __ENV.RAMP_DOWN || '10s';
const vus = parseInt(__ENV.VUS || '10');

export let options = {
    scenarios: {
        grpc_load_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: rampUpDuration, target: vus },
                { duration: loadDuration, target: vus },
                { duration: rampDownDuration, target: 0 },
            ],
        },
    },
};

const client = new grpc.Client();
client.load(['.'], 'grpc_pressure.proto');

export default () => {
    client.connect(TARGET, { plaintext: true });

    const response = client.invoke(METHOD, PAYLOAD);

    check(response, {
        'status is OK': (r) => r && r.status === grpc.StatusOK,
    });

    client.close();
};