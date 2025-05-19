import grpc from 'k6/net/grpc';
import { check, sleep } from 'k6';

const host = __ENV.GRPC_HOST || 'localhost';
const port = __ENV.GRPC_PORT || '50051';
const target = `${host}:${port}`;
const method = __ENV.GRPC_METHOD;
const protoFile = __ENV.GRPC_PROTO_FILE;

const payload = JSON.parse(__ENV.GRPC_PAYLOAD || '{}');

const rampUpDuration = __ENV.RAMP_UP || '10s';
const loadDuration = __ENV.LOAD || '30s';
const rampDownDuration = __ENV.RAMP_DOWN || '10s';
const vus = parseInt(__ENV.VUS || '10');

if (!method) {
    fail('Environment variable GRPC_METHOD is required.');
}

if (!protoFile) {
    fail('Environment variable GRPC_PROTO_FILE is required.');
}

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
client.load(['.'], protoFile);

export default () => {
    client.connect(target, { plaintext: true });

    const response = client.invoke(method, payload);

    check(response, {
        'status is OK': (r) => r && r.status === grpc.StatusOK,
    });

    client.close();
};