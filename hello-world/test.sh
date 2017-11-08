#!/bin/bash
set -e
cd "$(dirname "$0")"
# Get the current version.
version=$(grep "image: qlikea/engine" docker-compose.yml | cut -d':' -f3-)

# grep for expected string to verify correctness.
node app.js | grep "Hello, I am QIX Engine! I am running version: $version"
