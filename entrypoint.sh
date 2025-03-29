#!/bin/sh

echo "==========================================================="
echo "k6 Version Information"
echo "==========================================================="
k6 version
echo ""

echo "==========================================================="
echo "K6 Environment Variables"
echo "==========================================================="
ENV_VARS=""
for var in $(env | grep '^K6_' | cut -d= -f1); do
    value=$(eval echo \$$var)
    ENV_VARS="$ENV_VARS -e $var=$value"
    echo "$var"
done
echo ""

if [ -n "$K6_CLOUD_TOKEN" ]; then
    echo "==========================================================="
    echo "Running performance test locally with K6 Cloud mode"
    echo "==========================================================="
    k6 cloud run --local-execution $ENV_VARS "${K6_TEST_NAME}.js"
else
    echo "==========================================================="
    echo "Running performance test locally with K6"
    echo "==========================================================="
    k6 run $ENV_VARS "${K6_TEST_NAME}.js"
fi