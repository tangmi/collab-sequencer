#! /bin/bash

npm install requirejs # to install dependencies
npm install bower
npm install

./node_modules/.bin/bower install
./node_modules/.bin/r.js -o ./build.js