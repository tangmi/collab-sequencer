#! /bin/bash

command -v node >/dev/null 2>&1 || { echo >&2 "Node is not installed. Aborting."; exit 1; }

echo "\n============="
echo "Installing application dependencies..."
echo "============="
npm install

echo "\n============="
echo "Installing build dependencies..."
echo "============="
npm install requirejs # to install dependencies
npm install bower

echo "\n============="
echo "Installing front end dependencies (with Bower)..."
echo "============="
./node_modules/.bin/bower install

echo "\n============="
echo "Running RequireJS optimizer..."
echo "============="
./node_modules/.bin/r.js -o ./build.js

echo "\n============="
echo "Build Finished!"
echo "============="