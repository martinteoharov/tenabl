FROM node:17-bullseye AS frontend_base
EXPOSE 80
EXPOSE 443
RUN mkdir /tmp/npm
RUN chmod 777 /tmp/npm
ENV npm_config_cache=/tmp/npm
# Update version if NPM whines
RUN npm install -g npm@8.5.0
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json frontend/.npmrc /frontend/
RUN npm install
COPY frontend /frontend
COPY common /common
RUN chown node:node -R /frontend /common
USER node:node
RUN npm run build

FROM frontend_base AS frontend_debug
ENTRYPOINT [ "npm", "run", "start" ]

FROM caddy/caddy AS frontend
COPY --from=frontend_base /frontend/public /www
COPY frontend/Caddyfile /Caddyfile
ENTRYPOINT [ "caddy", "run", "--config", "/Caddyfile", "--adapter", "caddyfile" ]
VOLUME [ "/data", "/config" ]
