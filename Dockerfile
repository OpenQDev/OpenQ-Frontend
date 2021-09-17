FROM node:alpine
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
EXPOSE 3000
CMD yarn start