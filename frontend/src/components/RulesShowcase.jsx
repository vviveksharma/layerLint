import React from 'react'
import { motion } from 'framer-motion'

const RulesShowcase = () => {
  const rules = [
    {
      id: 'dockerfile/broad-copy-before-deps',
      severity: 'Critical',
      title: 'Broad COPY Before Dependencies',
      description: 'Copying all source files before installing dependencies breaks layer cache and forces unnecessary rebuilds.',
      impact: '30-45s slower builds',
      fix: 'Copy dependency manifests first, install dependencies, then copy source code'
    },
    {
      id: 'dockerfile/inefficient-cache',
      severity: 'High',
      title: 'Inefficient Layer Ordering',
      description: 'Frequently changing instructions placed before stable ones invalidate cache unnecessarily.',
      impact: '15-20s slower builds',
      fix: 'Place static dependencies and configuration before frequently changing source code'
    },
    {
      id: 'dockerfile/missing-cache-mounts',
      severity: 'Medium',
      title: 'Missing Cache Mounts',
      description: 'Package managers downloading the same packages repeatedly without cache persistence.',
      impact: '10-15s slower builds',
      fix: 'Add --mount=type=cache flags to package manager commands'
    }
  ]

  const getSeverityStyle = (severity) => {
    const styles = {
      Critical: 'bg-red-50 text-red-700 border-red-200',
      High: 'bg-orange-50 text-orange-700 border-orange-200',
      Medium: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    return styles[severity]
  }

  return (
    <section id="rules" className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detection Rules</span>
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mt-4 mb-6">
            Comprehensive Coverage
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            15+ intelligent rules covering all Docker caching anti-patterns
          </p>
        </motion.div>

        <div className="space-y-6">
          {rules.map((rule, idx) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getSeverityStyle(rule.severity)}`}>
                      {rule.severity}
                    </span>
                    <code className="text-gray-500 text-sm font-mono">{rule.id}</code>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">{rule.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{rule.description}</p>
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-gray-700">Fix:</span>
                    <span className="text-sm text-gray-600">{rule.fix}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <span className="text-sm text-gray-500">Impact: {rule.impact}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RulesShowcase