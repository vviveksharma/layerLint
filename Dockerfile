FROM golang:1.26.2-alpine

WORKDIR /app

COPY go.mod ./
COPY . .

RUN go build -o layerlint ./cmd/layerlint

ENTRYPOINT ["/app/layerlint"]
