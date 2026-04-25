# LayerLint

Catch Docker layer cache mistakes before they slow down CI.

## Overview

LayerLint is a static analysis tool that scans Dockerfiles to detect patterns that break Docker's layer caching mechanism. It helps developers identify common mistakes that lead to unnecessary rebuilds and slow CI/CD pipelines.

## Problem Statement

Docker uses layer caching to speed up builds by reusing unchanged layers. However, certain patterns in Dockerfiles can invalidate the cache prematurely:

- Copying all source files before installing dependencies
- Running dependency installs after broad COPY operations
- Inefficient layer ordering

These mistakes force Docker to rebuild layers unnecessarily, significantly slowing down development and CI/CD workflows.

## How It Works

LayerLint analyzes your Dockerfile through the following process:

1. **Parse**: Uses the Moby BuildKit parser to parse Dockerfile instructions into an AST
2. **Scan**: Applies configured rules to detect problematic patterns
3. **Report**: Outputs findings with severity, line numbers, and actionable suggestions

### Architecture

```
cmd/layerlint/
  ├── main.go           # Entry point
  └── cmd/
      ├── root.go       # CLI root command
      └── scan.go       # Scan command implementation

internal/
  ├── dockerfile/
  │   └── parser.go     # Dockerfile parsing using moby/buildkit
  ├── models/
  │   └── models.go     # Core data structures (Instruction, Finding, Rule)
  ├── scanner/
  │   └── scaner.go     # Rule orchestration and scanning logic
  └── rules/
      └── broad_copy_before_deps.go  # Rule implementations
```

## Installation

### From Source

```bash
git clone https://github.com/vviveksharma/layerLint
cd layerLint
make generate-build
```

This creates a `layerlint` binary in the current directory.

### Using Docker

```bash
docker build -t layerlint .
```

## Usage

### CLI

Scan a Dockerfile and get findings:

```bash
./layerlint scan --dockerfile path/to/Dockerfile
```

### GitHub Action

Add LayerLint to your CI workflow:

```yaml
name: Dockerfile Lint
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vviveksharma/layerLint@main
        with:
          dockerfile: ./Dockerfile
```

## Rules

### broad-copy-before-deps

**Severity**: High

**Description**: Detects when dependency installation commands run after broad source copy operations.

**Problem Example**:

```dockerfile
FROM golang:1.22
WORKDIR /app
COPY . .                    # Copies everything
RUN go mod download         # This runs after broad copy
RUN go build -o server
```

In this example, any source code change invalidates the `go mod download` layer cache, even if dependencies haven't changed.

**Recommended Fix**:

```dockerfile
FROM golang:1.22
WORKDIR /app
COPY go.mod go.sum ./       # Copy only dependency manifests
RUN go mod download         # Install dependencies (cached unless go.mod changes)
COPY . .                    # Copy source code
RUN go build -o server
```

**Detected Patterns**:
- Broad copies: `COPY . .`, `COPY . /`, `ADD . .`, `ADD . /`
- Dependency commands: `go mod download`, `npm install`, `npm ci`, `pnpm install`, `yarn install`, `pip install`, `poetry install`

## Output Format

Findings are reported in the following structure:

```
RuleID:     dockerfile/broad-copy-before-deps
Severity:   high
File:       testFiles/broad-copy-before-deps-failure
Line:       4
Title:      Dependency install runs after broad source copy
Message:    This dependency step runs after a broad COPY/ADD, so source changes can invalidate the dependency cache.
Suggestion: Copy dependency manifests first, install dependencies, then copy the rest of the source.
```

## Development

### Project Structure

- `cmd/` - Command-line interface implementation
- `internal/dockerfile/` - Dockerfile parsing logic
- `internal/models/` - Core data structures
- `internal/scanner/` - Rule execution engine
- `internal/rules/` - Rule implementations
- `testFiles/` - Test Dockerfiles for validation

### Adding New Rules

1. Create a new file in `internal/rules/`
2. Implement the `Rule` interface:
   ```go
   type Rule interface {
       ID() string
       Check(file string, instructions []Instruction) []Finding
   }
   ```
3. Register the rule in `internal/scanner/scaner.go` in the `DefaultRules()` function

### Building

```bash
make generate-build
```

### Testing

Run against test files:

```bash
./layerlint scan --dockerfile testFiles/broad-copy-before-deps-failure
```
