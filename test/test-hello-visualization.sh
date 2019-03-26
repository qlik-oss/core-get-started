#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

npx webdriver-manager update --standalone=false --gecko=false --versions.chrome=$(google-chrome --version | cut -d ' ' -f 3)
npx aw protractor -c ./test/aw.config.js
