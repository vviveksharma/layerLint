import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiArrowRight, FiSearch, FiAlertCircle, FiAlertTriangle, FiInfo, FiMenu, FiX, FiGithub } from 'react-icons/fi'
import Footer from '../components/Footer'

const rules = [
  {
    id: 'broad-copy-before-deps',
    title: 'Broad COPY Before Dependencies',
    severity: 'high',
    category: 'Layer Caching',
    description: 'Copying application code before installing dependencies breaks Docker layer caching. When you change any file in your app, Docker rebuilds all layers including dependency installation.',
    problem: 'Every code change forces complete dependency reinstallation, even if package.json/requirements.txt/go.mod hasn\'t changed. This multiplies build times by 10-50x for large projects.',
    impact: '45 seconds wasted per build × 50 builds/day = 37.5 minutes of developer time lost daily',
    badExample: `FROM node:20-alpine

COPY . /app
WORKDIR /app
RUN npm install

CMD ["npm", "start"]`,
    goodExample: `FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]`,
    fix: 'Copy only dependency manifests first (package.json, requirements.txt, go.mod), install dependencies, then copy application code. This way, dependency layers are cached unless manifests change.'
  },
  {
    id: 'manifest-without-lockfile',
    title: 'Manifest Without Lockfile',
    severity: 'high',
    category: 'Reproducibility',
    description: 'Installing dependencies without lockfiles (package-lock.json, yarn.lock, pnpm-lock.yaml) leads to non-reproducible builds. Different versions may be installed between builds.',
    problem: 'Without lockfiles, "works on my machine" becomes "worked yesterday" - builds become unpredictable, CI/CD pipelines break randomly, and debugging becomes a nightmare.',
    impact: 'Production incidents from version drift, inconsistent behavior across environments',
    badExample: `COPY package.json ./
RUN npm install`,
    goodExample: `COPY package.json package-lock.json ./
RUN npm ci

COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile`,
    fix: 'Always copy lockfiles with manifests. Use npm ci, pnpm install --frozen-lockfile, or yarn install --frozen-lockfile to ensure exact versions.'
  },
  {
    id: 'unpinned-base-image',
    title: 'Unpinned Base Image Tag',
    severity: 'medium',
    category: 'Security & Stability',
    description: 'Using tags like "latest", "stable", or version-only tags (node:20) without digest pins means your base image can change unexpectedly, breaking builds or introducing vulnerabilities.',
    problem: 'Base image updates can introduce breaking changes, security vulnerabilities, or alter system behavior. "latest" today is not "latest" tomorrow.',
    impact: 'Unpredictable builds, security vulnerabilities slipping in, difficult rollbacks',
    badExample: `FROM node:latest
FROM python:3.11
FROM ubuntu:stable`,
    goodExample: `FROM node:20-alpine@sha256:a1b2c3d4e5f6...
FROM python:3.11-slim@sha256:f6e5d4c3b2a1...

FROM node:20-alpine AS builder`,
    fix: 'Pin images with digest (@sha256:...). Use docker pull to get digests, or use specific version tags (node:20.10.0-alpine) with digests for maximum control.'
  },
  {
    id: 'copying-secrets',
    title: 'Copying Secrets Into Image',
    severity: 'high',
    category: 'Security',
    description: 'Copying secrets (.env files, private keys, tokens) into Docker images permanently embeds them in layers, even if deleted later. Anyone with image access can extract them.',
    problem: 'Docker layers are immutable. Even if you delete secrets in a subsequent RUN command, they remain in previous layers and can be extracted with docker history.',
    impact: 'Credential leaks, security breaches, compliance violations, data exposure',
    badExample: `COPY .env /app/
COPY id_rsa /root/.ssh/
RUN rm .env
RUN --mount=type=bind,source=.env,target=/app/.env npm build`,
    goodExample: `RUN --mount=type=secret,id=env,target=/app/.env npm build

docker build --secret id=env,src=.env .

ENV DATABASE_URL=placeholder
docker run -e DATABASE_URL=$DATABASE_URL myapp`,
    fix: 'Use BuildKit secrets (--mount=type=secret), build arguments with runtime override, or external secret management (AWS Secrets Manager, Vault). Never COPY secrets.'
  },
  {
    id: 'run-as-root',
    title: 'Run as Root User',
    severity: 'high',
    category: 'Security',
    description: 'Running containers as root (default) gives processes full system privileges. If compromised, attackers have root access to the host system.',
    problem: 'Container breakouts are real. Running as root means a vulnerability in your app = root access to host. This violates principle of least privilege.',
    impact: 'Severe security risk, compliance failures (PCI-DSS, SOC 2), Kubernetes admission policy violations',
    badExample: `FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "server.js"]`,
    goodExample: `FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
COPY --chown=appuser:appgroup . .
USER appuser
CMD ["node", "server.js"]`,
    fix: 'Create non-root user with adduser/useradd, use COPY --chown, switch with USER directive before CMD. Ensure app files and runtime directories are owned by this user.'
  },
  {
    id: 'missing-dockerignore',
    title: 'Missing .dockerignore File',
    severity: 'medium',
    category: 'Build Optimization',
    description: 'Without .dockerignore, Docker copies all files (including node_modules, .git, build artifacts) into build context, bloating build times and potentially including sensitive files.',
    problem: 'Every build uploads gigabytes of unnecessary files. Build context size directly impacts build speed. Large contexts also increase cache invalidation frequency.',
    impact: '5-10x slower builds, cache pollution, accidental secret exposure',
    badExample: `COPY . /app

Context: 2.3 GB transferred, 45s upload time`,
    goodExample: `.dockerignore contains:
node_modules/
.git/
dist/
*.log
.env*
README.md

Context: 85 MB transferred, 2s upload time`,
    fix: 'Create .dockerignore with patterns to exclude: node_modules, .git, test files, build artifacts, documentation, .env files, IDE configs.'
  },
  {
    id: 'build-without-cache-mount',
    title: 'Build Without Cache Mount',
    severity: 'low',
    category: 'Build Optimization',
    description: 'Package managers (npm, pip, go) download packages every build. BuildKit cache mounts persist these downloads across builds, dramatically reducing network usage and time.',
    problem: 'Repeatedly downloading the same packages wastes time and bandwidth. Cache mounts enable sharing downloaded packages between builds.',
    impact: '30-50% faster builds, reduced network usage, better CI/CD reliability',
    badExample: `RUN npm install
RUN pip install -r requirements.txt
RUN go mod download`,
    goodExample: `RUN --mount=type=cache,target=/root/.npm \\
    npm install

RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt

RUN --mount=type=cache,target=/go/pkg/mod \\
    go mod download`,
    fix: 'Add --mount=type=cache,target=<cache-dir> to RUN commands that download packages. Use correct cache paths for each package manager.'
  },
  {
    id: 'apt-update-split',
    title: 'apt-get update Without install',
    severity: 'medium',
    category: 'Layer Caching',
    description: 'Running apt-get update in a separate layer from apt-get install causes caching issues. The update layer is cached, but package lists become stale.',
    problem: 'Cached update layers mean subsequent builds use outdated package lists, potentially installing vulnerable or incorrect versions.',
    impact: 'Stale package installations, potential security vulnerabilities, build failures',
    badExample: `RUN apt-get update
RUN apt-get install -y curl wget`,
    goodExample: `RUN apt-get update && apt-get install -y \\
    curl \\
    wget \\
    && rm -rf /var/lib/apt/lists/*`,
    fix: 'Chain apt-get update && apt-get install in single RUN. Clean lists after install with rm -rf /var/lib/apt/lists/* to reduce image size.'
  },
  {
    id: 'multiple-broad-copies',
    title: 'Multiple Broad COPY Instructions',
    severity: 'medium',
    category: 'Layer Caching',
    description: 'Multiple COPY . instructions or copying entire directories repeatedly creates unnecessary layers and breaks caching unnecessarily.',
    problem: 'Each COPY creates a new layer. Broad copies invalidate caches even when only a small file changes. More layers = larger images.',
    impact: 'Bloated images, slower builds, inefficient layer caching',
    badExample: `COPY . /app/
COPY . /tmp/build/
COPY src/ /app/src/
COPY . /app/final/`,
    goodExample: `COPY package*.json ./
RUN npm install

COPY src/ ./src/
COPY public/ ./public/
COPY *.config.js ./`,
    fix: 'Copy only what\'s needed, when needed. Be specific with source paths. Group related files. Structure COPY commands by change frequency (dependencies first, code last).'
  },
  {
    id: 'redundant-dependency-install',
    title: 'Redundant Dependency Installation',
    severity: 'medium',
    category: 'Build Optimization',
    description: 'Installing the same dependencies multiple times in different stages or running npm install twice wastes time and space.',
    problem: 'Duplicate installations multiply build time unnecessarily. Often seen in multi-stage builds where dependencies are installed in both stages.',
    impact: '2-3x longer builds, wasted CI/CD resources, larger intermediate images',
    badExample: `FROM node:20 AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm install
RUN npm run build

FROM node:20-alpine
COPY package*.json ./
RUN npm install --production`,
    goodExample: `FROM node:20 AS builder
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist`,
    fix: 'Install dependencies once per stage. Use npm ci for production. In multi-stage builds, consider copying node_modules from builder if appropriate.'
  },
  {
    id: 'add-instead-of-copy',
    title: 'ADD Instead of COPY',
    severity: 'low',
    category: 'Best Practices',
    description: 'ADD has implicit behavior (auto-extraction of archives, URL downloads) that can cause unexpected issues. COPY is explicit and safer.',
    problem: 'ADD automatically extracts .tar files, which can be surprising. It also downloads URLs, which is less cacheable and transparent than using curl/wget in RUN.',
    impact: 'Confusing behavior, potential security risks from auto-extraction, less predictable builds',
    badExample: `ADD archive.tar.gz /app/
ADD https://example.com/file.zip /tmp/
ADD . /app/`,
    goodExample: `COPY archive.tar.gz /app/
RUN tar -xzf /app/archive.tar.gz

RUN curl -L https://example.com/file.zip -o /tmp/file.zip

COPY . /app/`,
    fix: 'Use COPY for regular files and directories. Use RUN with curl/wget for URLs. Explicitly extract archives in RUN commands. Reserve ADD only when you specifically need auto-extraction.'
  },
  {
    id: 'wget-curl-without-checksum',
    title: 'Downloads Without Checksum Verification',
    severity: 'medium',
    category: 'Security',
    description: 'Downloading files with curl/wget without verifying checksums allows MITM attacks or corrupted downloads to compromise your image.',
    problem: 'Downloaded files could be tampered with, corrupted, or replaced by attackers. Without verification, you have no guarantee of authenticity.',
    impact: 'Security vulnerabilities, supply chain attacks, corrupted binaries in production',
    badExample: `RUN curl -L https://example.com/binary -o /usr/local/bin/tool
RUN wget https://example.com/package.tar.gz && tar -xzf package.tar.gz`,
    goodExample: `RUN curl -L https://example.com/binary -o /usr/local/bin/tool \\
    && echo "a3b5c7d9e1f2... /usr/local/bin/tool" | sha256sum -c -

RUN wget https://example.com/package.tar.gz \\
    && echo "f2e1d9c7b5a3... package.tar.gz" | sha256sum -c - \\
    && tar -xzf package.tar.gz`,
    fix: 'Always verify downloads with sha256sum or sha512sum. Get checksums from official sources. Use && echo "CHECKSUM filename" | sha256sum -c - pattern.'
  }
]

function Docs() {
  const [selectedRule, setSelectedRule] = useState(rules[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredRules = rules.filter(rule =>
    rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentIndex = rules.findIndex(r => r.id === selectedRule.id)
  const prevRule = currentIndex > 0 ? rules[currentIndex - 1] : null
  const nextRule = currentIndex < rules.length - 1 ? rules[currentIndex + 1] : null

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <FiAlertCircle className="inline" />
      case 'medium':
        return <FiAlertTriangle className="inline" />
      case 'low':
        return <FiInfo className="inline" />
      default:
        return <FiInfo className="inline" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              <Link to="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-gray-900 hover:text-blue-600 transition-colors">
                <img src="/favicon.svg" alt="LayerLint" className="w-8 h-8" />
                LayerLint
              </Link>
              <span className="text-sm text-gray-500 hidden sm:block">/ Documentation</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back to Home
              </Link>
              <a
                href="https://github.com/yourusername/layerlint"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FiGithub size={20} />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 1024) && (
              <motion.aside
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="fixed lg:sticky top-20 left-0 w-80 h-[calc(100vh-5rem)] bg-white rounded-lg border border-gray-200 p-6 overflow-y-auto z-30 lg:z-0"
              >
                <div className="mb-6">
                  <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search rules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    All Rules ({filteredRules.length})
                  </div>
                  {filteredRules.map((rule) => (
                    <button
                      key={rule.id}
                      onClick={() => {
                        setSelectedRule(rule)
                        if (window.innerWidth < 1024) setSidebarOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                        selectedRule.id === rule.id
                          ? 'bg-blue-50 text-blue-900 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm line-clamp-2">{rule.title}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${getSeverityColor(rule.severity)} whitespace-nowrap`}>
                          {rule.severity}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      <span>High Severity ({rules.filter(r => r.severity === 'high').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                      <span>Medium Severity ({rules.filter(r => r.severity === 'medium').length})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                      <span>Low Severity ({rules.filter(r => r.severity === 'low').length})</span>
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          <main className="flex-1 max-w-4xl">
            <motion.div
              key={selectedRule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-8 lg:p-12"
            >
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full border text-sm font-medium ${getSeverityColor(selectedRule.severity)}`}>
                    {getSeverityIcon(selectedRule.severity)} {selectedRule.severity.toUpperCase()} SEVERITY
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                    {selectedRule.category}
                  </span>
                </div>
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                  {selectedRule.title}
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {selectedRule.description}
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <FiAlertCircle className="text-red-500" />
                    Why This Matters
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedRule.problem}
                  </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-amber-900 mb-2 flex items-center gap-2">
                    <FiAlertTriangle />
                    Impact
                  </h3>
                  <p className="text-amber-800">
                    {selectedRule.impact}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    Code Examples
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-red-600">❌ Bad Practice</span>
                      </div>
                      <pre className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-x-auto text-sm">
                        <code className="text-red-900 font-mono">{selectedRule.badExample}</code>
                      </pre>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-semibold text-green-600">✅ Good Practice</span>
                      </div>
                      <pre className="bg-green-50 border border-green-200 rounded-lg p-4 overflow-x-auto text-sm">
                        <code className="text-green-900 font-mono">{selectedRule.goodExample}</code>
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FiInfo />
                    How to Fix
                  </h3>
                  <p className="text-blue-800 leading-relaxed">
                    {selectedRule.fix}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="flex items-center justify-between mt-8 gap-4">
              {prevRule ? (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedRule(prevRule)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  <div className="text-left">
                    <div className="text-xs text-gray-500">Previous</div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{prevRule.title}</div>
                  </div>
                </Link>
              ) : <div />}

              {nextRule && (
                <Link
                  to="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedRule(nextRule)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group ml-auto"
                >
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Next</div>
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{nextRule.title}</div>
                  </div>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Docs
