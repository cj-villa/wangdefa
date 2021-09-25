#!/bin/bash
echo "rm -rf ./node_modules..."
rm -rf ./node_modules
echo "rm -rf ./packages/app/node_modules"
rm -rf ./packages/app/node_modules
echo "rm -rf ./packages/react-page/node_modules"
rm -rf ./packages/react-page/node_modules
# rm ./yarn.lock
