FROM node:10

ARG HOST_UID=1000
ARG HOST_GID=1000

RUN groupmod -g $HOST_GID node && usermod -u $HOST_UID node
