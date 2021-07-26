# water-safety-plan
wsp.akvotest.org

# Development

```bash
docker-compose up -d
```

then visit: ['localhost:3000']('http://localhost:3000')

Any endpoint with prefix `/api` will be redirected to `http://localhost:5000`
see: https://github.com/akvo/water-safety-plan/blob/main/frontend/src/setupProxy.js

# Production

```bash
docker-compose -f docker-compose.yml -f docker-compose.ci.yml up -d
```
then visit: ['localhost:8080']('http://localhost:8080')

Endpoints with prefix `/api` is redirected to `http://backend:5000` inside container
see:
- [nginx](https://github.com/akvo/water-safety-plan/blob/main/frontend/nginx/conf.d/default.conf) config
- [mainnetwork](https://github.com/akvo/water-safety-plan/blob/5374de56d43be1d8d80607010d94d90b41184bd3/docker-compose.ci.yml#L4-L7) container setup
