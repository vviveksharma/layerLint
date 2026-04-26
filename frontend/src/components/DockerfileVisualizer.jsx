import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi'

const DockerfileVisualizer = () => {
  const [activeExample, setActiveExample] = useState(0)

  const examples = [
    {
      title: 'Broad Copy Before Dependencies',
      impact: '30-45s slower',
      bad: `FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]`,
      good: `FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]`,
      badLines: [3],
      goodLines: [3, 4],
      explanation: 'Copy dependency files first, install packages, then copy source'
    },
    {
      title: 'Missing Cache Mounts',
      impact: '10-15s slower',
      bad: `FROM golang:1.22
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o app`,
      good: `FROM golang:1.22
WORKDIR /app
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \\
    go mod download
COPY . .
RUN go build -o app`,
      badLines: [4],
      goodLines: [4, 5],
      explanation: 'Use BuildKit cache mounts to persist package downloads'
    },
    {
      title: 'Unpinned Base Image',
      impact: 'Reproducibility issues',
      bad: `FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .`,
      good: `FROM node:18.20.0
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .`,
      badLines: [1],
      goodLines: [1],
      explanation: 'Pin exact versions for reproducible builds'
    }
  ]

  const currentExample = examples[activeExample]

  const renderCode = (code, highlightLines, isGood) => {
    const lines = code.split('\n')
    return lines.map((line, idx) => {
      const lineNumber = idx + 1
      const isHighlighted = highlightLines.includes(lineNumber)
      
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: isGood ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`flex items-start gap-3 py-1 px-4 font-mono text-sm ${
            isHighlighted
              ? isGood
                ? 'bg-green-500/10 border-l-2 border-green-500'
                : 'bg-red-500/10 border-l-2 border-red-500'
              : ''
          }`}
        >
          <span className="text-gray-400 select-none w-6 text-right flex-shrink-0">
            {lineNumber}
          </span>
          <span className={isHighlighted ? (isGood ? 'text-green-700' : 'text-red-700') : 'text-gray-700'}>
            {line}
          </span>
        </motion.div>
      )
    })
  }

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">See the Impact</span>
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mt-4 mb-6">
            Before & After Optimization
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Visual examples of common issues and their fixes
          </p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {examples.map((example, idx) => (
            <button
              key={idx}
              onClick={() => setActiveExample(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeExample === idx
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {example.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeExample}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <div className="grid md:grid-cols-2 divide-x divide-gray-200">
              <div className="relative">
                <div className="bg-red-50 px-6 py-4 border-b border-red-200 flex items-center gap-3">
                  <FiAlertCircle className="text-red-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-red-900">Before</h3>
                    <p className="text-xs text-red-600">{currentExample.impact}</p>
                  </div>
                </div>
                <div className="bg-gray-900 overflow-x-auto">
                  <pre className="py-4 text-sm">
                    {renderCode(currentExample.bad, currentExample.badLines, false)}
                  </pre>
                </div>
              </div>

              <div className="relative">
                <div className="bg-green-50 px-6 py-4 border-b border-green-200 flex items-center gap-3">
                  <FiCheckCircle className="text-green-600" size={20} />
                  <div>
                    <h3 className="font-semibold text-green-900">After LayerLint</h3>
                    <p className="text-xs text-green-600">Optimized</p>
                  </div>
                </div>
                <div className="bg-gray-900 overflow-x-auto relative">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-green-500/10 to-green-500/5"
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <pre className="py-4 text-sm relative z-10">
                    {renderCode(currentExample.good, currentExample.goodLines, true)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center gap-3 border-t border-gray-200">
              <FiArrowRight className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Fix: </span>
                {currentExample.explanation}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default DockerfileVisualizer
