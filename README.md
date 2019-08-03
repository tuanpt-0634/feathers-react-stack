# Intro
Docker, FeathersJS, ReactJS, MongoDB

# Setup
Using docker:
```bash
docker-compose up -d
```

Execute a command (npm, node...) in workspace:
```bash
docker-compose exec workspace yarn setup
docker-compose exec workspace yarn server:dev
docker-compose exec workspace yarn web:dev
docker-compose exec workspace yarn feathers --version
```
