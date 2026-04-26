import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTerminal, FiCopy, FiCheck, FiPlay, FiCommand } from 'react-icons/fi'

const DemoSection = () => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('cli')

  const demoCommands = {
    cli: `# One-command installation
curl -sSL https://layerlint.dev/install.sh | sh

# Scan your Dockerfile
layerlint scan --dockerfile Dockerfile

# Generate JSON report
layerlint scan --dockerfile Dockerfile --format json --output report.json

# Generate SARIF for GitHub Security
layerlint scan --dockerfile Dockerfile --format sarif --output results.sarif

# HTML report for sharing
layerlint scan --dockerfile Dockerfile --format html --output report.html`,
    
    github: `name: LayerLint CI/CD
on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vviveksharma/layerLint@main
        with:
          dockerfile: ./Dockerfile
      
      - name: Upload SARIF to GitHub Security
        if: always()
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: results.sarif`,
    
    precommit: `# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: layerlint
        name: LayerLint
        entry: layerlint scan --dockerfile
        language: system
        files: Dockerfile.*
        pass_filenames: true

# Install pre-commit: pip install pre-commit
# Run: pre-commit install`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(demoCommands[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Quick Start</span>
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mt-4 mb-6">
            Get Started in Seconds
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Multiple ways to integrate LayerLint into your workflow
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="flex border-b border-gray-200">
            {[
              { id: 'cli', label: 'CLI', icon: FiTerminal },
              { id: 'github', label: 'GitHub Actions', icon: FiPlay },
              { id: 'precommit', label: 'Pre-commit Hook', icon: FiCommand },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTabBar"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {copied ? <FiCheck className="text-gray-900" size={18} /> : <FiCopy className="text-gray-600" size={18} />}
            </button>
            
            <div className="p-8 font-mono text-sm bg-gray-50 overflow-x-auto">
              <pre className="text-gray-800">
                <code>{demoCommands[activeTab]}</code>
              </pre>
            </div>
          </div>

          <div className="bg-white p-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-serif text-gray-900 mb-1">2</div>
                <div className="text-sm text-gray-500">Integration Methods</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-gray-900 mb-1">12+</div>
                <div className="text-sm text-gray-500">Active Rules</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-gray-900 mb-1">0</div>
                <div className="text-sm text-gray-500">Build Required</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif text-gray-900 mb-1">100%</div>
                <div className="text-sm text-gray-500">Open Source</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DemoSection