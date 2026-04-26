import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiGithub } from 'react-icons/fi'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >        

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif mb-8 text-gray-900 leading-tight">
            Optimize Docker
            <br />
            Layer Caching
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Static analysis that identifies Docker layer caching anti-patterns.
            <br />
            Speed up CI/CD pipelines by 10x with intelligent optimization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
              <FiArrowRight size={18} />
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/vviveksharma/layerLint"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-900 rounded-full font-medium hover:border-gray-400 transition-colors"
            >
              <FiGithub size={18} />
              View on GitHub
            </motion.a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-gray-200">
            {[
              { value: '10x', label: 'Faster Builds' },
              { value: '98%', label: 'Cache Hit Rate' },
              { value: '12+', label: 'Detection Rules' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-serif text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero