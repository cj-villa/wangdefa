#!/usr/bin/env bash
npx husky install
npx husky set .husky/pre-commit "npx lint-staged --config node_modules/@l/lint/configs/.lintstagedrc"
npx husky set .husky/commit-msg "npx commitlint -e $GIT_PARAMS --config node_modules/@l/lint/configs/commit.js"