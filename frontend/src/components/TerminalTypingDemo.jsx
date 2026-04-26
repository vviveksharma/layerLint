import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTerminal, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'

const TerminalTypingDemo = () => {
  const [step, setStep] = useState(0)
  const [typedCommand, setTypedCommand] = useState('')

  const command = 'layerlint scan --dockerfile Dockerfile'
  const scanResults = [
    { severity: 'high', message: 'Broad COPY before dependencies detected', file: 'Dockerfile:5' },
    { severity: 'medium', message: 'Missing cache mount for npm install', file: 'Dockerfile:8' },
    { severity: 'low', message: 'Consider pinning base image version', file: 'Dockerfile:1' }
  ]

  useEffect(() => {
    if (step === 0) {
      if (typedCommand.length < command.length) {
        const timeout = setTimeout(() => {
          setTypedCommand(command.slice(0, typedCommand.length + 1))
        }, 80)
        return () => clearTimeout(timeout)
      } else {
        setTimeout(() => setStep(1), 500)
      }
    }

    if (step === 1) {
      const timeout = setTimeout(() => setStep(2), 2500)
      return () => clearTimeout(timeout)
    }

    if (step === 2) {
      const timeout = setTimeout(() => {
        setStep(0)
        setTypedCommand('')
      }, 4000)
      return () => clearTimeout(timeout)
    }
  }, [step, typedCommand])

  return (
    <section id="demo" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Live Demo</span>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mt-4 mb-6">
            See It In Action
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800"
        >
          <div className="bg-gray-800 px-6 py-3 flex items-center gap-2 border-b border-gray-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-2 ml-4">
              <FiTerminal className="text-gray-400" size={16} />
              <span className="text-gray-400 text-sm font-mono">terminal</span>
            </div>
          </div>

          <div className="p-6 font-mono text-sm min-h-[400px]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400">$</span>
              <span className="text-gray-300">{typedCommand}</span>
              {step === 0 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-green-400"
                />
              )}
            </div>

            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="text-gray-400 mb-4">
                    <span className="text-blue-400">LayerLint</span> v2.0.0 - Docker Layer Cache Optimizer
                  </div>

                  <div className="text-yellow-400 font-semibold mb-3">
                    Found 3 optimization opportunities
                  </div>

                  {scanResults.map((result, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.15 }}
                      className={`pl-4 py-2 border-l-2 ${
                        result.severity === 'high'
                          ? 'border-red-500 text-red-400'
                          : result.severity === 'medium'
                          ? 'border-yellow-500 text-yellow-400'
                          : 'border-blue-500 text-blue-400'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <FiAlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="font-semibold">{result.message}</div>
                          <div className="text-gray-500 text-xs mt-1">{result.file}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TerminalTypingDemo
