import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { FiClock, FiZap, FiTrendingDown } from 'react-icons/fi'

const BuildTimePredictor = () => {
  const [selectedRules, setSelectedRules] = useState([])
  const buildTime = useMotionValue(45)
  const displayTime = useTransform(buildTime, (value) => Math.round(value))

  const rules = [
    { id: 1, name: 'Broad COPY', savings: 25 },
    { id: 2, name: 'Cache Mounts', savings: 12 },
    { id: 3, name: 'Layer Ordering', savings: 8 },
    { id: 4, name: 'Pin Versions', savings: 5 }
  ]

  useEffect(() => {
    const totalSavings = selectedRules.reduce((sum, id) => {
      const rule = rules.find(r => r.id === id)
      return sum + (rule?.savings || 0)
    }, 0)

    const newTime = Math.max(3, 45 - totalSavings)
    
    animate(buildTime, newTime, {
      duration: 0.8,
      ease: "easeOut"
    })
  }, [selectedRules])

  const toggleRule = (ruleId) => {
    setSelectedRules(prev => 
      prev.includes(ruleId)
        ? prev.filter(id => id !== ruleId)
        : [...prev, ruleId]
    )
  }

  const totalSavings = selectedRules.reduce((sum, id) => {
    const rule = rules.find(r => r.id === id)
    return sum + (rule?.savings || 0)
  }, 0)

  const savingsPercentage = Math.round((totalSavings / 45) * 100)

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Interactive Calculator</span>
          <h2 className="text-4xl md:text-5xl font-serif text-white mt-4 mb-6">
            Calculate Your Time Savings
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Select optimization rules to see real-time build time improvements
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-gray-400 uppercase mb-4">Select Optimizations</h3>
            {rules.map((rule) => (
              <motion.button
                key={rule.id}
                onClick={() => toggleRule(rule.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedRules.includes(rule.id)
                    ? 'bg-green-500/20 border-2 border-green-500 shadow-lg shadow-green-500/20'
                    : 'bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedRules.includes(rule.id)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-600'
                    }`}>
                      {selectedRules.includes(rule.id) && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </motion.svg>
                      )}
                    </div>
                    <span className="font-medium text-white">{rule.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-400">-{rule.savings}s</span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <FiClock className="text-gray-400" size={24} />
                <h3 className="text-lg font-semibold text-gray-300">Build Time</h3>
              </div>

              <div className="relative mb-6">
                <motion.div className="text-7xl font-bold text-white font-mono">
                  00:<motion.span>{displayTime}</motion.span>
                </motion.div>
                <span className="text-gray-400 text-sm">seconds</span>
              </div>

              {totalSavings > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                    <div className="flex items-center gap-2">
                      <FiZap className="text-green-400" size={20} />
                      <span className="text-green-400 font-semibold">Time Saved</span>
                    </div>
                    <span className="text-2xl font-bold text-green-400">{totalSavings}s</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                    <div className="flex items-center gap-2">
                      <FiTrendingDown className="text-blue-400" size={20} />
                      <span className="text-blue-400 font-semibold">Improvement</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-400">{savingsPercentage}%</span>
                  </div>
                </motion.div>
              )}

              {selectedRules.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Select optimization rules to see savings
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default BuildTimePredictor
