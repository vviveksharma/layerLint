import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiTerminal, FiCopy, FiCheck, FiPlay, FiCommand } from 'react-icons/fi'

const DemoSection = () => {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('cli')
  const [isHovered, setIsHovered] = useState(false)

  const demoCommands = {
    cli: `# One-command installation
curl -sSL https://layerlint.dev/install.sh | sh

# Scan with AI suggestions
layerlint scan --dockerfile Dockerfile --ai

# Auto-fix mode
layerlint fix --dockerfile Dockerfile --auto

# Watch mode for development
layerlint watch --dockerfile Dockerfile`,
    
    github: `name: LayerLint CI/CD
on: [push, pull_request]

jobs:
  optimize:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vviveksharma/layerLint@v2.0.0
        with:
          dockerfile: ./Dockerfile
          auto-fix: true
          severity: high`,
    
    vscode: `# VS Code Extension
ext install layerlint.vscode-extension

# Features:
# • Real-time linting
# • One-click fixes
# • Build time predictions
# • AI suggestions`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(demoCommands[activeTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="demo" className="py-32 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/30 mb-4">
            <span className="text-[#00f3ff] text-sm font-medium">QUICK START</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#00f3ff] via-white to-[#ff00e5] bg-clip-text text-transparent">
              Start in Seconds
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Multiple ways to integrate LayerLint into your workflow
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative group"
        >
          <div className={`absolute -inset-1 bg-gradient-to-r from-[#00f3ff] to-[#bf00ff] rounded-2xl blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'}`}></div>
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-[#00f3ff]/30 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {[
                { id: 'cli', label: 'CLI', icon: FiTerminal },
                { id: 'github', label: 'GitHub Actions', icon: FiPlay },
                { id: 'vscode', label: 'VS Code', icon: FiCommand },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === tab.id
                      ? 'text-[#00f3ff]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabBar"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00f3ff] to-[#bf00ff]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Terminal Content */}
            <div className="relative">
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/10"
              >
                {copied ? <FiCheck className="text-green-400" size={18} /> : <FiCopy className="text-gray-300" size={18} />}
              </button>
              
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300 whitespace-pre-wrap">
                  <code>{demoCommands[activeTab]}</code>
                </pre>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-gradient-to-r from-[#00f3ff]/5 to-[#bf00ff]/5 p-4 border-t border-white/10">
              <div className="flex flex-wrap justify-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-gray-400 text-xs">Integration Methods</div>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#00f3ff]/30 to-transparent"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-gray-400 text-xs">Active Rules</div>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#00f3ff]/30 to-transparent"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">0</div>
                  <div className="text-gray-400 text-xs">Build Required</div>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-[#00f3ff]/30 to-transparent"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-gray-400 text-xs">Free & Open Source</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default DemoSection