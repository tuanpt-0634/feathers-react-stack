#!/bin/bash
cd /home/node/app

if [ ! -d /home/node/app/node_modules ]; then
    yarn install
fi

yarn start
