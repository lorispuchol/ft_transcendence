FROM node:alpine

ENV NPM_CONFIG_LOGLEVEL info

COPY ./ /app/

RUN apk update

WORKDIR '/app'

CMD ["npm", "start"]
# CMD ["npm", "run", "start:dev"]
