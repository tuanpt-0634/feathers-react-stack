# Intro
Docker, FeathersJS, ReactJS, MongoDB

# Setup
Config docker:
```bash
cp .env.example .env
```
Update `.env` with your uid, gid from command `id`:
```bash
id

# uid=1234(user) gid=1234(user)
```
=> `.env`:
```ini
HOST_UID=1234
HOST_GID=1234
```
Start docker:
```bash
docker-compose up -d
```

Execute a command (npm, node...) in workspace:
```bash
# Run command in "server" container
./bin/server bash

# Run command in "web" container
./bin/web bash
```

Restart server:
```bash
# Restart "server" container (Feathers)
docker-compose restart server

# Restart "web" container (React)
docker-compose restart web
```

Run docker container as "root" user:
```bash
docker-compose exec -u root server bash
docker-compose exec -u root wev bash
```

Learn more in [docker document](./docs/docker.md)

# Default servers
- http://localhost:3033 - Node API server
- http://localhost:3003 - Web client React
- http://localhost:8083 - Mongo Express
- http://localhost:8003 - Swagger Editor to view API docs
- http://localhost:8023 - Mail box
