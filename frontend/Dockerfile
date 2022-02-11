FROM node:15-buster AS frontend_base
EXPOSE 80
EXPOSE 443
RUN mkdir /tmp/npm
RUN chmod 777 /tmp/npm
ENV npm_config_cache=/tmp/npm
RUN npm install -g npm@7.15.1
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json frontend/.npmrc /frontend/
RUN npm install
COPY frontend /frontend
COPY common /common
RUN chown node:node -R /frontend /common
USER node:node

FROM frontend_base AS frontend_debug
ENTRYPOINT [ "npm", "run", "debug" ]

FROM nginx AS nginx
COPY frontend/bin /www
COPY frontend/Caddyfile /Caddyfile
ENTRYPOINT [ "caddy", "run", "--config", "/Caddyfile", "--adapter", "caddyfile" ]
VOLUME [ "/data", "/config" ]
