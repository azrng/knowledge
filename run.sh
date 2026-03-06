#!/bin/bash

echo -n "Whether to pull(y/n): "
read choice

if [ "$choice" == "y" ]; then
    git pull
else

pnpm run docs:dev