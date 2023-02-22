FROM node:19-alpine

WORKDIR /app

COPY dbconfig.json .
COPY _config ./_config
COPY simulation ./simulation
RUN cd simulation && npm install

CMD cd simulation && node main.js
