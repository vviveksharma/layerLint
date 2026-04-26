# Rules

What LayerLint checks for and why it matters.

## broad-copy-before-deps

**High Severity**

The big one. Don't copy everything before installing dependencies.

Bad:
```dockerfile
FROM node:18
COPY . .        # Every code change = reinstall everything
RUN npm ci
```

Good:
```dockerfile
FROM node:18
COPY package.json package-lock.json ./
RUN npm ci      # Only reinstalls if package files change
COPY . .
```

Works for npm, go, pip, poetry, yarn, pnpm. Same idea - copy manifests first, install, then copy code.

## manifest-without-lockfile

**High Severity**

Running `npm ci` without `package-lock.json` or `go mod download` without `go.sum` defeats the point of lockfiles.

Bad:
```dockerfile
COPY package.json ./
RUN npm ci              # Where's package-lock.json?
```

Good:
```dockerfile
COPY package.json package-lock.json ./
RUN npm ci
```

Lockfiles = reproducible builds. Don't skip them.

## unpinned-base-image-tag

**Medium Severity**

Using `:latest` or no tag means your builds aren't reproducible.

Bad:
```dockerfile
FROM node:latest
FROM golang          # Implicit :latest
```

Good:
```dockerfile
FROM node:18.20.0
FROM golang:1.22.3
```

Pick a version and stick with it. Upgrade explicitly.

## copying-secrets-into-image

**High Severity**

Don't put secrets in images. Even if you delete them later, they're still in the layer history.

Bad:
```dockerfile
COPY .env /app/
COPY id_rsa /root/.ssh/
```

Good:
```dockerfile
# Build secrets (BuildKit)
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci

# Or env vars at runtime
docker run -e API_KEY=$API_KEY myapp
```

## run-as-root

**High Severity**

Containers run as root by default. Don't let them.

Bad:
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
CMD ["node", "server.js"]    # Runs as root
```

Good:
```dockerfile
FROM node:18
RUN adduser -S appuser
WORKDIR /app
COPY --chown=appuser:appuser . .
USER appuser
CMD ["node", "server.js"]
```

## missing-dockerignore

**Medium Severity**

No `.dockerignore` = sending everything to the build context. node_modules, .git, test files, all of it.

Create `.dockerignore`:
```
node_modules/
.git/
dist/
*.log
.env*
README.md
```

Faster builds, smaller context, less risk of leaking stuff.

## build-without-cache-mount

**Low Severity**

BuildKit cache mounts speed up builds by sharing downloaded packages between builds.

Bad:
```dockerfile
RUN npm ci           # Downloads everything each time
RUN go mod download
```

Good:
```dockerfile
RUN --mount=type=cache,target=/root/.npm npm ci
RUN --mount=type=cache,target=/go/pkg/mod go mod download
```

Works with npm, go, pip, poetry, apt.

## apt-update-without-install

**Medium Severity**

Don't run `apt-get update` in a separate RUN from `apt-get install`. The update layer gets cached and goes stale.

Bad:
```dockerfile
RUN apt-get update
RUN apt-get install -y curl
```

Good:
```dockerfile
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
```

Chain them together, clean up after.

## multiple-broad-copies

**Medium Severity**

Copying everything multiple times is wasteful and breaks caching.

Bad:
```dockerfile
COPY . .
RUN npm build
COPY . .    # Why twice?
```

Copy once, in the right order.

## redundant-dependency-install

**Medium Severity**

Running the same install command twice means something's wrong with your layer structure.

Bad:
```dockerfile
RUN npm install
RUN npm build
RUN npm install    # Already did this
```

Fix the layer ordering instead.

## add-instead-of-copy

**Low Severity**

`ADD` has magic behavior (auto-extracts tars, downloads URLs). `COPY` is clearer.

Bad:
```dockerfile
ADD . /app/
ADD https://example.com/file.tar.gz /tmp/
```

Good:
```dockerfile
COPY . /app/
RUN curl -O https://example.com/file.tar.gz
```

Use `ADD` only when you specifically want the magic. Otherwise use `COPY`.

## wget-curl-without-checksum

**Medium Severity**

Downloading files without verifying checksums is asking for supply chain issues.

Bad:
```dockerfile
RUN curl -L https://example.com/binary -o /usr/local/bin/tool
RUN wget https://example.com/package.tar.gz
```

Good:
```dockerfile
RUN curl -L https://example.com/binary -o /usr/local/bin/tool && \
    echo "a3b5c7d9e1f2... /usr/local/bin/tool" | sha256sum -c -
```

Get the checksum from the official source, verify it.
