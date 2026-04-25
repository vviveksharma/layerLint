import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiZap, FiShield, FiTrendingUp, FiCpu, 
  FiGitBranch, FiClock, FiAward, FiGlobe 
} from 'react-icons/fi'

const Features = () => {
  const features = [
    {
      icon: FiZap,
      title: 'Lightning Fast',
      description: 'Static analysis without building images. Get results in milliseconds.',
      gradient: 'from-[#00f3ff] to-[#00f3ff]/50',
      stat: '~50ms'
    },
    {
      icon: FiShield,
      title: '15+ Detection Rules',
      description: 'Comprehensive rules for all caching anti-patterns.',
      gradient: 'from-[#bf00ff] to-[#bf00ff]/50',
      stat: '96% coverage'
    },
    {
      icon: FiTrendingUp,
      title: '10x Faster Builds',
      description: 'Optimize layer caching to reduce CI/CD build times dramatically.',
      gradient: 'from-[#ff00e5] to-[#ff00e5]/50',
      stat: 'industry best'
    },
    {
      icon: FiCpu,
      title: 'Intelligent Analysis',
      description: 'Advanced pattern recognition for optimal layer ordering.',
      gradient: 'from-[#00f3ff] to-[#bf00ff]',
      stat: 'smart detection'
    },
    {
      icon: FiGitBranch,
      title: 'CI/CD Native',
      description: 'Native GitHub Action + all major CI platforms.',
      gradient: 'from-[#bf00ff] to-[#ff00e5]',
      stat: 'ready'
    },
    {
      icon: FiClock,
      title: 'Real-time Feedback',
      description: 'Instant suggestions with line numbers and auto-fix options.',
      gradient: 'from-[#ff00e5] to-[#00f3ff]',
      stat: 'live'
    }
  ]

  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/30 mb-4">
            <span className="text-[#00f3ff] text-sm font-medium">CORE FEATURES</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-linear-to-r from-[#00f3ff] via-white to-[#bf00ff] bg-clip-text text-transparent">
              Next-Gen Analysis
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Built for modern DevOps workflows with intelligent insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#00f3ff]/50 transition-all duration-300">
                <div className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white" size={28} />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <span className="text-xs text-[#00f3ff] font-mono bg-[#00f3ff]/10 px-2 py-1 rounded-full">
                    {feature.stat}
                  </span>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features