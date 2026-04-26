import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiZap, FiShield, FiTrendingUp, FiCpu, 
  FiGitBranch, FiClock
} from 'react-icons/fi'

const Features = () => {
  const features = [
    {
      icon: FiZap,
      title: 'Lightning Fast Analysis',
      description: 'Static analysis without building images. Get results in milliseconds, not minutes.'
    },
    {
      icon: FiShield,
      title: '15+ Detection Rules',
      description: 'Comprehensive rules covering all common Docker layer caching anti-patterns.'
    },
    {
      icon: FiTrendingUp,
      title: '10x Faster Builds',
      description: 'Optimize layer caching to dramatically reduce CI/CD build times.'
    },
    {
      icon: FiCpu,
      title: 'Intelligent Pattern Recognition',
      description: 'Advanced analysis for optimal layer ordering and dependency management.'
    },
    {
      icon: FiGitBranch,
      title: 'CI/CD Native',
      description: 'Native GitHub Action support plus integration with all major CI platforms.'
    },
    {
      icon: FiClock,
      title: 'Real-time Feedback',
      description: 'Instant suggestions with precise line numbers and actionable fixes.'
    }
  ]

  return (
    <section id="features" className="py-32 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Features</span>
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mt-4 mb-6">
            Built for Modern DevOps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Intelligent analysis with powerful insights for your Docker workflow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-6">
                <feature.icon className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features