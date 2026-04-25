import React from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiArrowRight, FiStar, FiHeart } from 'react-icons/fi'

const CTASection = () => {
  return (
    <section className="py-32 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          viewport={{ once: true }}
          className="relative group"
        >
          <div className="absolute -inset-2 bg-linear-to-r from-[#00f3ff] via-[#bf00ff] to-[#ff00e5] rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative bg-black/60 backdrop-blur-2xl rounded-3xl overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,#00f3ff_0%,transparent_70%)] opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[radial-gradient(circle,#bf00ff_0%,transparent_70%)] opacity-20"></div>
            
            <div className="relative z-10 p-12 text-center">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
                className="w-20 h-20 mx-auto mb-6 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <FiStar className="text-white" size={40} />
              </motion.div>
              
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Ready to <span className="bg-linear-to-r from-[#00f3ff] to-[#ff00e5] bg-clip-text text-transparent">10x</span> Your Builds?
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join 10,000+ developers using LayerLint to optimize Docker layer caching and speed up CI/CD pipelines.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px #00f3ff' }}
                  whileTap={{ scale: 0.95 }}
                  href="https://github.com/vviveksharma/layerLint"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] rounded-xl font-semibold text-white hover:shadow-2xl transition-all"
                >
                  <FiGithub size={20} />
                  Star on GitHub
                  <FiHeart className="ml-1" />
                </motion.a>
                
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="#demo"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-white/20 transition-all"
                >
                  Start Free
                  <FiArrowRight />
                </motion.a>
              </div>
              
              <p className="text-gray-400 text-sm mt-6">
                No credit card required • Open source • Forever free
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection