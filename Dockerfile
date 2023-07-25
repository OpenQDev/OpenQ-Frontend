# Stage 0: Install dependencies
FROM node:18.15.0-alpine AS deps
WORKDIR /app
RUN apk update && apk upgrade && apk add --no-cache bash git
COPY package.json yarn.lock ./
RUN yarn --production --frozen-lockfile

# Stage 1: Build the application
FROM node:18.15.0-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG deploy_env
ENV DEPLOY_ENV=$deploy_env
RUN yarn build

# Stage 2: Create a minimal image for runtime
FROM node:18.15.0-alpine AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
EXPOSE 3000
ARG deploy_env
ENV DEPLOY_ENV=$deploy_env
CMD ["yarn", "start"]
