FROM node:lts-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git
RUN apk add python3
COPY . .
ARG deploy_env
ENV DEPLOY_ENV=$deploy_env
RUN yarn
EXPOSE 3000
ENTRYPOINT yarn start