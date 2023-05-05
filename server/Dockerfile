FROM node:alpine

COPY ./ /app/

RUN apk update

WORKDIR '/app'

RUN npm install && npm audit fix

CMD ["npm", "start"]
#CMD ["npm", "run", "serve"]
#cmd ["npm", "run", "start", "--", "--host", "--port", "8080"]
