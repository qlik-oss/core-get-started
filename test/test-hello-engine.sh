#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

# Get the current version.
version=$(grep "image: qlikea/engine" docker-compose.yml | cut -d':' -f3-)

# grep for expected string to verify correctness.
if node src/hello-engine/hello-engine.js | grep "Engine version retrieved"; then
    echo $'\nHello Engine test succeded'
    exit 0
else
    echo $'\nHello Engine test failed: "$version"'
    exit 1
fi
