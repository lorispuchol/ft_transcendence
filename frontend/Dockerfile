FROM node:19.5.0-alpine

EXPOSE 8585

COPY ./ /app/

RUN apk update

WORKDIR '/app'

RUN npm init -y
RUN npm install .
#RUN npm audit fix

ENV TZ=Europe/Paris
RUN apk add tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# RUN npm install serve
# RUN npm run build

# CMD ["serve", "-s", "build"]
CMD ["npm", "run", "start"]