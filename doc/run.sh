#!/usr/bin/env bash
docker build -t wsp-transform .
docker run --rm -v "$(pwd)":/app wsp-transform
docker rmi wsp-transform
rm -rf ../backend/data
cp -r data ../backend/data
rm -rf data
