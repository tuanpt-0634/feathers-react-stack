FROM node:10

ARG HOST_UID=1000
ARG HOST_GID=1000

# There is a bug when user id is too large
# https://github.com/moby/moby/issues/28920
# https://github.com/docker/docker.github.io/pull/3413/files
# We need to using `useradd` with option `--no-log-init`
RUN userdel -r node
RUN groupadd --gid $HOST_GID node \
  && useradd --uid $HOST_UID --gid node --shell /bin/bash --create-home --no-log-init node
