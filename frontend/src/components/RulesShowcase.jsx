import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertCircle, FiCode, FiCheck, FiCopy, FiHeart } from 'react-icons/fi'

const RulesShowcase = () => {
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  const rules = [
    {
      id: 'dockerfile/broad-copy-before-deps',
      severity: 'critical',
      title: 'Broad COPY Before Dependencies',
      description: 'Copying all source files before installing dependencies breaks layer cache.',
      impact: '~30-45s slower build',
      fix: 'Reorder layers to copy manifests first',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      id: 'dockerfile/inefficient-cache',
      severity: 'high',
      title: 'Inefficient Layer Ordering',
      description: 'Frequently changing instructions placed before stable ones.',
      impact: '~15-20s slower build',
      fix: 'Place static dependencies before source code',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 'dockerfile/missing-cache-mounts',
      severity: 'medium',
      title: 'Missing Cache Mounts',
      description: 'Package managers downloading same packages repeatedly.',
      impact: '~10-15s slower build',
      fix: 'Add --mount=type=cache flag',
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
    return badges[severity]
  }

  return (
    <section id="rules" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#ff00e5]/10 border border-[#ff00e5]/30 mb-4">
            <span className="text-[#ff00e5] text-sm font-medium">DETECTION RULES</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#ff00e5] via-white to-[#00f3ff] bg-clip-text text-transparent">
              15+ Intelligent Rules
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive coverage for all Docker caching anti-patterns
          </p>
        </motion.div>

        <div className="space-y-6">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, x: 10 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff] to-[#bf00ff] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-mono border ${getSeverityBadge(rule.severity)}`}>
                        {rule.severity.toUpperCase()}
                      </span>
                      <code className="text-[#00f3ff] text-sm font-mono">{rule.id}</code>
                      <span className="text-gray-500 text-sm">Impact: {rule.impact}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{rule.title}</h3>
                    <p className="text-gray-400 mb-3">{rule.description}</p>
                    <div className="text-green-400 text-sm">
                      🔧 Fix: {rule.fix}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setLiked(!liked)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <FiHeart className={liked ? 'text-red-400 fill-red-400' : 'text-gray-400'} size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        copyToClipboard(rule.id)
                        setCopied(true)
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      {copied ? <FiCheck className="text-green-400" size={20} /> : <FiCopy className="text-gray-400" size={20} />}
                    </motion.button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></span>
                    Active detection • Real-time analysis • Auto-fix available
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
}

export default RulesShowcase