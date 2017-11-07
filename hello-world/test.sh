#!/bin/bash
set -e
cd "$(dirname "$0")"
#get the current version
version=$(grep "image: qlikea/engine" docker-compose.yml | cut -d':' -f3-)

#grep for the sucesfull string and thus test that we succeded, the script will exit with code 0 if the string is found and 1 otherwise
node app.js | grep "Hello, I am QIX Engine! I am running version: $version"


