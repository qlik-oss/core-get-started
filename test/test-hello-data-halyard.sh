#!/bin/bash
set -e
cd "$(dirname "$0")"
cd ..

# grep for expected last five movies and session close to verify correctness.
expected_five_last_movies="Cleopatra\nEvan Almighty\nGreen Lantern\nHarry Potter and the Half-Blood Prince\nIndiana Jones and the Kingdom of the Crystal Skull"
if node src/hello-data/hello-data-halyard.js | grep -Pzo "$expected_five_last_movies"; then
    echo $'\nhello-data-halyard test succeded'
    exit 0
else
    echo $'\nhello-data-halyard test failed'
    exit 1
fi
