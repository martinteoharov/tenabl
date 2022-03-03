FROM node:17-bullseye AS api_base

# ===== NPM cache fix =====
RUN mkdir /tmp/npm
RUN chmod 777 /tmp/npm
ENV npm_config_cache=/tmp/npm
RUN npm install -g package-json-merge@0.0.1
# Update version if NPM whines
RUN npm install -g npm@8.5.0

# ===== Environmental dependencies (uncomment if needed) =====
# RUN apt-get update
# RUN apt-get install \
#   make gcc \
#   -y
# # You probably need make and GCC if you need apt

WORKDIR /common
COPY common/package.json \
    common/package-lock.json \
    common/.npmrc \
    /common/
RUN npm install
COPY common /common

WORKDIR /api
COPY api/package.json \
    api/package-lock.json \
    api/.npmrc \
    /api/
RUN npm install
COPY api /api


RUN chown node:node -R /api
USER node:node
EXPOSE 80

FROM api_base AS api_debug
EXPOSE 9229
CMD [ "npm", "run", "debug" ]

FROM api_base AS api_build
RUN npm run build

FROM api_build AS api
RUN npm prune --production
CMD [ "npm", "run", "run"]

FROM api_build AS migrations
ENTRYPOINT [ "npm", "run", "typeorm", "--", "migration:run" ]