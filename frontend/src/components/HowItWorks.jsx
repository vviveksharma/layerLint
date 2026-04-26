import React from 'react'
import { motion } from 'framer-motion'
import { FiFile, FiSearch, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const HowItWorks = () => {
  const steps = [
    {
      icon: FiFile,
      step: '01',
      title: 'Parse Dockerfile',
      description: 'LayerLint reads your Dockerfile using Docker\'s official BuildKit parser for accurate analysis.'
    },
    {
      icon: FiSearch,
      step: '02',
      title: 'Pattern Detection',
      description: '12+ specialized rules scan for anti-patterns with intelligent suggestions.'
    },
    {
      icon: FiAlertTriangle,
      step: '03',
      title: 'Identify Issues',
      description: 'Each finding includes severity level, precise line numbers, and clear explanations.'
    },
    {
      icon: FiCheckCircle,
      step: '04',
      title: 'Get Recommendations',
      description: 'Actionable fixes and optimization strategies tailored to your Dockerfile.'
    }
  ]

  return (
    <section id="how-it-works" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">How It Works</span>
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mt-4 mb-6">
            Simple Workflow
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four steps to faster, more efficient Docker builds
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-6xl font-serif text-gray-100 mb-4">{step.step}</div>
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                <step.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks