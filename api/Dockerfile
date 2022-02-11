FROM node:17-bullseye AS api_base

# ===== NPM cache fix =====
RUN mkdir /tmp/npm
RUN chmod 777 /tmp/npm
ENV npm_config_cache=/tmp/npm
# Update version if NPM whines
RUN npm install -g npm@8.5.0

# ===== Environmental dependencies (uncomment if needed) =====
# RUN apt-get update
# RUN apt-get install \
#   make gcc \
#   -y
# # You probably need make and GCC if you need apt

WORKDIR /api
COPY api/package.json api/package-lock.json api/.npmrc /api/
RUN npm install

COPY api /api
COPY common /common

RUN chown node:node -R /api
USER node:node
EXPOSE 80

FROM api_base AS api_debug
EXPOSE 9229
ENTRYPOINT [ "npm", "run" ]
CMD [ "debug" ]

FROM api_base AS api
RUN npm run build
RUN npm prune --production
ENTRYPOINT [ "npm", "run" ]
CMD [ "run" ]