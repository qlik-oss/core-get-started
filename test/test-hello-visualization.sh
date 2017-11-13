#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

docker-compose up -d
npm install --quiet
npm run build
npm run hello-visualization &

./node_modules/.bin/webdriver-manager update
node ./node_modules/after-work.js/bin/aw-webdriver-test-runner ./node_modules/after-work.js/dist/config/conf.dev.js --specs ./test/*.spec.js
