# Intro
Docker, FeathersJS, ReactJS, MongoDB

# Setup
Using docker:
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
