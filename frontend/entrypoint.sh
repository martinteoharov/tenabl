#!/bin/bash

cleanup() {
    echo "Replacing common directory with symlink..."
    rm -rf src/common
    ln -s ../../common src/common
}

_term() {
    echo "Stopping application..."
    kill -TERM "$APPLICATION"
    echo "Stopping lsyncd..."
    kill -TERM "$LSYNCD"
    cleanup
}

trap _term SIGTERM

echo "Replacing common symlink with directory..."
rm -f src/common
cp -r ../common src/common

echo "Starting lsyncd..."
lsyncd -nodaemon lsyncd.lua | sed -e 's/^/Lsyncd: /;' &
LSYNCD=$!

echo "Starting application..."
"${@}" &
APPLICATION=$!

wait "$APPLICATION"
STATUS=$?
cleanup
exit $STATUS