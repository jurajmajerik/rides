FROM node:19-alpine

WORKDIR /app

COPY dbconfig.json .
COPY shared ./shared
COPY simulation ./simulation
RUN cd simulation && npm install

CMD cd simulation && node main.js
