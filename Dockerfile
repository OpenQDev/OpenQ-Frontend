FROM node:alpine
RUN mkdir -p /usr/src
RUN apk update && apk upgrade && \
    apk add --no-cache bash git
WORKDIR /usr/src
COPY . /usr/src
RUN yarn
RUN yarn build
EXPOSE 3000
CMD yarn start