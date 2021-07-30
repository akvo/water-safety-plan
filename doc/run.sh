#!/usr/bin/env bash

docker run --rm -v "$(pwd)":/app "$(docker build -q .)"
cp -r data ../backend/data
rm -rf data
