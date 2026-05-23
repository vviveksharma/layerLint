FROM golang:1.26.3-alpine

WORKDIR /app

COPY go.mod ./
COPY . .

RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    go build -o layerlint ./cmd/layerlint

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENTRYPOINT ["/app/layerlint"]
