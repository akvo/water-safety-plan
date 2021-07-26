#!/usr/bin/env bash

docker build -t wsp/data-generator:latest .
docker run --rm -v "$(pwd)":/app wsp/data-generator
cp ./results/config.json ../frontend/src/data/config.json
mv ./results/config.json ../backend/data/config.json
mv ./results/data.csv ../backend/data/data.csv
