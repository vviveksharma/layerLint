import React from 'react'
import { motion } from 'framer-motion'
import { FiFile, FiSearch, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

const HowItWorks = () => {
  const steps = [
    {
      icon: FiFile,
      step: '01',
      title: 'Parse Dockerfile',
      description: 'LayerLint reads your Dockerfile using Docker\'s official BuildKit parser.',
      gradient: 'from-[#00f3ff] to-[#00f3ff]'
    },
    {
      icon: FiSearch,
      step: '02',
      title: 'Pattern Detection',
      description: '15+ specialized rules scan for anti-patterns with smart suggestions.',
      gradient: 'from-[#bf00ff] to-[#bf00ff]'
    },
    {
      icon: FiAlertTriangle,
      step: '03',
      title: 'Identify Issues',
      description: 'Each finding includes severity, line numbers, and explanations.',
      gradient: 'from-[#ff00e5] to-[#ff00e5]'
    },
    {
      icon: FiCheckCircle,
      step: '04',
      title: 'Auto-Fix',
      description: 'One-click fixes and intelligent suggestions for optimization.',
      gradient: 'from-[#00f3ff] to-[#ff00e5]'
    }
  ]

  return (
    <section id="how-it-works" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#bf00ff]/10 border border-[#bf00ff]/30 mb-4">
            <span className="text-[#bf00ff] text-sm font-medium">HOW IT WORKS</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-linear-to-r from-[#bf00ff] via-white to-[#ff00e5] bg-clip-text text-transparent">
              Four Steps to Speed
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Simple workflow with powerful analysis behind the scenes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#00f3ff]/50 transition-all duration-300 h-full">
                <div className="absolute -top-4 -right-4 text-6xl font-bold text-[#00f3ff]/10 group-hover:text-[#00f3ff]/20 transition-all duration-300">
                  {step.step}
                </div>
                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${step.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-[#00f3ff]/30 text-2xl">
                    →
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks