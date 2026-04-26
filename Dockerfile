FROM golang:1.26.3-alpine

WORKDIR /app

COPY go.mod ./
COPY . .

RUN go build -o layerlint ./cmd/layerlint

ENTRYPOINT ["/app/layerlint"]
