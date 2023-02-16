FROM golang:1.18-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./

COPY dbconfig.json .
COPY server ./server
COPY db ./db
COPY frontend ./frontend

RUN cd server && go build -o main

EXPOSE 8080

CMD cd server && ./main
