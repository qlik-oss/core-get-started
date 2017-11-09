#!/bin/bash
set -e
cd "$(dirname "$0")"

npm install --quiet
docker-compose up -d

# grep for expected last five movies and session close to verify correctness.
#node hello-data.js | grep -Pzo "CleopatraPELLE\nEvan Almighty\nGreen Lantern\nHarry Potter and the Half-Blood Prince\nIndiana Jones and the Kingdom of the Crystal Skull"
if node hello-data.js | grep -Pzo "Cleopa1tra\nEvan Almighty\nGreen Lantern\nHarry Potter and the Half-Blood Prince\nIndiana Jones and the Kingdom of the Crystal Skull"; then
    echo $'\nHello-Data test succeded'
else
    echo $'\nHello-Data test failed'
fi
exit $?
