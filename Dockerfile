FROM node:18.15.0-alpine
WORKDIR /app
RUN apk update && apk upgrade && \
	apk add --no-cache bash git 
COPY . .
RUN yarn
EXPOSE 3000
ENTRYPOINT boot:local-targeting-staging