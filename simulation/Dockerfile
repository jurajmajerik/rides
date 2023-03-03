FROM node:19-alpine

WORKDIR /app

COPY dbconfig.json .
COPY shared ./shared
COPY simulation ./simulation
RUN cd simulation && npm install && npm run build

CMD cd simulation && cd dist && node index.js
