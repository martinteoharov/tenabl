FROM node:17-bullseye AS extension_base
EXPOSE 80
EXPOSE 443
RUN mkdir /tmp/npm
RUN chmod 777 /tmp/npm
ENV npm_config_cache=/tmp/npm
# Update version if NPM whines
RUN npm install -g npm@8.5.0

WORKDIR /extension
COPY extension/package.json \
    extension/package-lock.json \
    extension/.npmrc \
    /extension/
RUN npm install
COPY extension /extension
WORKDIR /common
COPY common/package.json \
    common/package-lock.json \
    common/.npmrc \
    /common/
RUN npm install
COPY common /common
RUN chown node:node -R /extension /common


FROM extension_base AS extension_debug
WORKDIR /extension
CMD [ "npm", "run", "dev" ]


FROM extension_base AS extension
USER node:node
WORKDIR /extension
RUN npm run build
CMD [ "npm", "run", "build" ]