#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

./node_modules/.bin/webdriver-manager update --standalone false --gecko false
./node_modules/.bin/aw protractor -c ./test/aw.config.js