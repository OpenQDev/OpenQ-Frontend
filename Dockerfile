FROM node:alpine
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
COPY . .
ARG deploy_env
ENV DEPLOY_ENV=$deploy_env
ARG node_opt
ENV NODE_OPTIONS=$node_opt
RUN yarn
RUN yarn build
EXPOSE 3000
ENTRYPOINT yarn start