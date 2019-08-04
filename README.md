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
./bin/server yarn dev

# Run command in "web" container
./bin/web bash
./bin/web yarn start
```
