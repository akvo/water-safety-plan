# Water Safety Plan Demo
[![Build Status](https://akvo.semaphoreci.com/badges/water-safety-plan/branches/master.svg?style=shields)](https://akvo.semaphoreci.com/projects/water-safety-plan)

https://wsp.akvotest.org

--------------

# Prerequisite

[this link](https://docs.google.com/spreadsheets/d/1fwb3e7RNf34TwSjAa7sf2tDmnTt0rGp4mV1s2Crvzak/edit#gid=0) is required to be exported as **dummy.xlsx** inside [./doc](https://github.com/akvo/water-safety-plan/tree/main/doc) folder before running the app.

Then you need to generate `config.json` and `data.csv` files

```bash
cd ./doc
docker build -t wsp/data-generator:latest .
docker run --rm -v "$(pwd)":/app wsp/data-generator
cp ./results/config.json ../frontend/src/data/config.json
mv ./results/config.json ../backend/data/config.json
mv ./results/data.csv ../backend/data/data.csv
```

# 

# Development

```bash
docker-compose up -d
```

The app should be running at: [localhost:3000](http://localhost:3000). Any endpoints with prefix `/api` will be redirected to [localhost:5000](http://localhost:5000)

see: [setupProxy.js](https://github.com/akvo/water-safety-plan/blob/main/frontend/src/setupProxy.js)

# Production

```bash
export CI_COMMIT='local'
./ci/build.sh
```
This will generate two docker images with prefix `eu.gcr.io/akvo-lumen/water-safety-plan` for backend and frontend

```bash
docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d
```

Then visit: [localhost:8080](http://localhost:8080). Any endpoints with prefix `/api` is redirected to `http://backend:5000` inside the network container

see:
- [nginx](https://github.com/akvo/water-safety-plan/blob/main/frontend/nginx/conf.d/default.conf) config
- [mainnetwork](https://github.com/akvo/water-safety-plan/blob/5374de56d43be1d8d80607010d94d90b41184bd3/docker-compose.ci.yml#L4-L7) container setup
