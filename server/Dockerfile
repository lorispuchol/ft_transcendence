FROM node:alpine

COPY ./ /app/

RUN apk update

WORKDIR '/app'

RUN npm install && npm audit fix

#EXPOSE 5173
EXPOSE 8080

CMD ["npm", "start"]
#CMD ["npm", "run", "serve"]
#cmd ["npm", "run", "start", "--", "--host", "--port", "8080"]
