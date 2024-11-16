ARG NODE_VERSION=20.16.0
ARG HUSKY=0

FROM node:${NODE_VERSION}-alpine AS base-node
RUN apk update # only for alpine version
RUN apk add --no-cache libc6-compat # only for alpine version

# Setup pnpm and turbo on the base-node base
FROM base-node AS base
ARG SIMPPLR_NPM_TOKEN
RUN npm install pnpm@9.12.1 turbo@2.1.3 --global && pnpm config set store-dir ~/.pnpm-store

# Prune projects
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build the project
FROM base AS builder
ARG PROJECT
ARG SIMPPLR_NPM_TOKEN
ARG HUSKY=0

WORKDIR /app

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN echo 'NodeVersion:' $(node --version) 

#RUN echo 'SIMPPLR_NPM_TOKEN:' ${SIMPPLR_NPM_TOKEN}
# First install the dependencies (as they change less often)
#works with docker 
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install  --frozen-lockfile

#works with podman
#RUN pnpm install  --frozen-lockfile

# Copy source code of isolated subworkspace
COPY --from=pruner /app/out/full/ .

WORKDIR /app/services/${PROJECT}
RUN pnpm install
WORKDIR /app

RUN turbo build --filter=${PROJECT}
#works with docker
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional

#works with podman
#RUN  pnpm prune --prod --no-optional
RUN rm -rf ./packages/*/src && rm -rf ./services/*/src

# Final image
FROM base-node AS runner
ARG PROJECT

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/services/${PROJECT}

ARG PORT=5000
ENV PORT=${PORT}
EXPOSE ${PORT}

CMD node dist/main