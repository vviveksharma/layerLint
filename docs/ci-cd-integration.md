# CI/CD Integration

How to run LayerLint in your pipeline.

## GitHub Actions

Basic:
```yaml
name: Lint
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

Multiple Dockerfiles:
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        dockerfile: [Dockerfile, Dockerfile.prod, services/api/Dockerfile]
    steps:
      - uses: actions/checkout@v3
      - uses: vviveksharma/layerLint@main
        with:
          dockerfile: ${{ matrix.dockerfile }}
```

## GitLab CI

```yaml
lint:dockerfile:
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
    - curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh
  script:
    - layerlint scan --dockerfile Dockerfile
  only:
    - merge_requests
    - main
```

## CircleCI

```yaml
version: 2.1
jobs:
  lint:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - run:
          name: Install LayerLint
          command: curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh
      - run:
          name: Lint Dockerfile
          command: layerlint scan --dockerfile Dockerfile

workflows:
  build:
    jobs:
      - lint
```

## Jenkins

```groovy
pipeline {
    agent any
    stages {
        stage('Lint') {
            steps:
                sh 'curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh'
                sh 'layerlint scan --dockerfile Dockerfile'
            }
        }
    }
}
```

## Azure Pipelines

```yaml
trigger:
  - main

pool:
  vmImage: ubuntu-latest

steps:
  - script: |
      curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh
      layerlint scan --dockerfile Dockerfile
    displayName: 'Lint Dockerfile'
```

## Travis CI

```yaml
language: minimal

before_install:
  - curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh

script:
  - layerlint scan --dockerfile Dockerfile
```

## Bitbucket Pipelines

```yaml
pipelines:
  default:
    - step:
        name: Lint Dockerfile
        script:
          - curl -sSL https://raw.githubusercontent.com/vviveksharma/layerLint/main/install.sh | sh
          - layerlint scan --dockerfile Dockerfile
```

## Fail on High Severity

Most platforms - just check exit code. LayerLint exits 1 when it finds issues.

For more control, use JSON output and parse it:

```bash
layerlint scan --dockerfile Dockerfile --format json --output report.json
# Parse report.json and fail based on severity
```

## Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: layerlint
        name: LayerLint
        entry: layerlint scan --dockerfile
        language: system
        files: Dockerfile.*
        pass_filenames: true
```

## Caching

Most CI systems cache between runs. Cache the LayerLint binary:

**GitHub Actions**:
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.local/bin/layerlint
    key: layerlint-${{ runner.os }}
```

**GitLab CI**:
```yaml
cache:
  paths:
    - layerlint
```

Saves a few seconds per run.
