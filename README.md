# Intro
Docker, FeathersJS, ReactJS, MongoDB

# Setup
Using docker:
```bash
cp docker/docker-compose.dev.example.yml docker-compose.yml
docker-compose up -d
```

Execute a command (npm, node...) in workspace:
```bash
docker-compose exec workspace yarn
docker-compose exec workspace yarn start
```
