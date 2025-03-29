FROM debian:stable-slim

ARG K6_VERSION=0.57.0
ARG TARGETARCH

ENV K6_TEST_NAME=http-load-test

# Install k6
RUN apt update && apt install -y --no-install-recommends \
    curl \
    tar \
    ca-certificates \
    && curl -L https://github.com/grafana/k6/releases/download/v${K6_VERSION}/k6-v${K6_VERSION}-linux-${TARGETARCH}.tar.gz -o /tmp/k6.tar.gz \
    && tar -xzf /tmp/k6.tar.gz -C /tmp \
    && mv /tmp/k6-v${K6_VERSION}-linux-${TARGETARCH}/k6 /usr/local/bin/ \
    && chmod +x /usr/local/bin/k6