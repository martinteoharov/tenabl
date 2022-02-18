FROM node:17-bullseye AS frontend_base
EXPOSE 80
EXPOSE 443
RUN mkdir /tmp/npm
RUN chmod 777 /tmp/npm
ENV npm_config_cache=/tmp/npm
# Update version if NPM whines
RUN npm install -g npm@8.5.0

WORKDIR /frontend
COPY frontend/package.json \
    frontend/package-lock.json \
    frontend/.npmrc \
    /frontend/
RUN npm install
COPY frontend /frontend
WORKDIR /common
COPY common/package.json \
    common/package-lock.json \
    common/.npmrc \
    /common/
RUN npm install
COPY common /common
RUN chown node:node -R /frontend /common


FROM frontend_base AS frontend_debug
RUN apt-get update
RUN apt-get install lsyncd -y
WORKDIR /frontend
ENTRYPOINT [ "/frontend/entrypoint.sh" ]
CMD [ "npm", "run", "start" ]


FROM frontend_base AS frontend_build
USER node:node
WORKDIR /frontend
RUN ./entrypoint.sh npm run build


FROM caddy/caddy AS frontend
COPY --from=frontend_build /frontend/build /www
COPY frontend/Caddyfile /Caddyfile
ENTRYPOINT [ "caddy", "run", "--config", "/Caddyfile", "--adapter", "caddyfile" ]
VOLUME [ "/data", "/config" ]
