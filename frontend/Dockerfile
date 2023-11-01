FROM node:21-alpine

ENV NPM_CONFIG_LOGLEVEL silent

EXPOSE 8585

COPY ./ /app/

RUN apk update
ENV TZ=Europe/Paris
RUN apk add tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR '/app'

RUN npm init -y
RUN npm install .
#RUN npm audit fix

# ENTRYPOINT ["sh", "prod.sh"]

# RUN npm install serve
# RUN npm run build

# CMD ["serve", "-s", "build"]
CMD ["npm", "run", "start"]
