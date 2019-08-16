#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

npx webdriver-manager update --standalone false --gecko false
npx aw protractor -c ./test/aw.config.js
