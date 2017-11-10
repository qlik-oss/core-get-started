#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

docker-compose up -d
npm install --quiet

# grep for expected last five movies and session close to verify correctness.
expected_five_last_movies="Cleopatra\nEvan Almighty\nGreen Lantern\nHarry Potter and the Half-Blood Prince\nIndiana Jones and the Kingdom of the Crystal Skull"
if node hello-data/hello-data.js | grep -Pzo "$expected_five_last_movies"; then
    echo $'\nHello Data test succeded'
    exit 0
else
    echo $'\nHello Data test failed'
    exit 1
fi
