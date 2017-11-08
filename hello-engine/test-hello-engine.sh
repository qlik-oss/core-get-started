#!/bin/bash
set -e
cd "$(dirname "$0")"

npm install --quiet
docker-compose up -d
sleep 5

# Get the current version.
version=$(grep "image: qlikea/engine" docker-compose.yml | cut -d':' -f3-)

# grep for expected string to verify correctness.
node hello-engine.js | grep "Engine returned that it's running version: $version"
