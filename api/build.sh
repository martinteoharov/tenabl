#!/bin/bash

# Build index
npx tsc

# Rebuild common separately
rm -rf bin/api/src/common
cp -r /common bin/api/src/
cd bin/api/src/common
npm install
npx tsc
npm prune --production