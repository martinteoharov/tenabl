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

echo "Initialising common..."
(cd ../common; npm install)

echo "Replacing common symlink with directory..."
rm -r src/common || rm -rf src/common
cp -r /common src/common
rm -rf src/common/node_modules

if command -v lsyncd &> /dev/null
then
    echo "Starting lsyncd..."
    lsyncd -nodaemon lsyncd.lua | sed -e 's/^/Lsyncd: /;' &
    LSYNCD=$!
else
    echo "Lsyncd not found, live syncing disabled" 1>&2
fi 

echo "Starting application..."
"${@}" &
APPLICATION=$!

wait "$APPLICATION"
STATUS=$?
cleanup
exit $STATUS