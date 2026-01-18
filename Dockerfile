FROM alpine:latest@sha256:51183f2cfa6320055da30872f211093f9ff1d3cf06f39a0bdb212314c5dc7375

ARG K6_VERSION=1.5.0
ARG TARGETARCH

ENV K6_TEST_NAME=http-load-test

RUN apk add --no-cache \
    curl \
    tar \
    ca-certificates

RUN curl -L https://github.com/grafana/k6/releases/download/v${K6_VERSION}/k6-v${K6_VERSION}-linux-${TARGETARCH}.tar.gz -o /tmp/k6.tar.gz

RUN tar -xzf /tmp/k6.tar.gz -C /tmp
RUN mv /tmp/k6-v${K6_VERSION}-linux-${TARGETARCH}/k6 /usr/local/bin/
RUN chmod +x /usr/local/bin/k6

COPY tests/ /tests/
COPY entrypoint.sh /entrypoint.sh

WORKDIR /tests

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]