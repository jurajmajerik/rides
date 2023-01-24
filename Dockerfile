FROM golang:1.18-alpine

WORKDIR /app

COPY go.mod ./
COPY go.sum ./
COPY *.go ./
COPY static ./static
COPY postgres ./postgres

RUN go build -o /main

EXPOSE 8080

CMD [ "/main" ]