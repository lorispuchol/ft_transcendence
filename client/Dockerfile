FROM node:alpine

WORKDIR '/app'

COPY ./ ./app/

RUN npm install && npm update

CMD ["npm", "start"]