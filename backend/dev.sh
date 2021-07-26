#!/usr/bin/env bash
set -eu
pip install --cache-dir=.pip -r requirements.txt
pip check

uvicorn main:app --reload --port 5000
