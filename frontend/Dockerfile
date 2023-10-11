FROM node:19.5.0-alpine

#ENV NPM_CONFIG_LOGLEVEL info

EXPOSE 8585

COPY ./ /app/

RUN apk update

WORKDIR '/app'

#RUN npm init -y
#RUN npm install .
#RUN npm audit fix

#CMD ["npm", "run", "build"]
ENTRYPOINT ["sh", "entrypoint_dev.sh"]