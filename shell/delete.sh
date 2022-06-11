#!/bin/bash

echo "[1/2]delete all node_modules ..."
find . -name "node_modules" -type d -exec rm -rf '{}' +

echo "[2/2]delete all lock file ..."
find . -name "*.lock" -type f -exec rm -rf '{}' +
