#!/bin/bash
set -e
cd "$(dirname "$0")"

npm install --quiet
docker-compose up -d
sleep 5
# grep for expected last five movies and session close to verify correctness.
node hello-data.js | grep -Pzo "Cleopatra\nEvan Almighty\nGreen Lantern\nHarry Potter and the Half-Blood Prince\nIndiana Jones and the Kingdom of the Crystal Skull"
