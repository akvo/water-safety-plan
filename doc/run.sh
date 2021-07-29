#!/usr/bin/env bash

docker build -t wsp/data-generator:latest .
docker run --rm -v "$(pwd)":/app wsp/data-generator
cp -r ./data/ ../backend/data/
rm -rf data
