FROM node:alpine
WORKDIR /app
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
COPY . .
RUN yarn
RUN yarn build
EXPOSE 3000
ENV DEPLOY_ENV=production
ENTRYPOINT yarn start