import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiGithub, FiArrowRight } from 'react-icons/fi'

const CTASection = () => {
  return (
    <section className="py-32 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-white rounded-3xl p-16 shadow-lg"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-gray-900 mb-6">
            Ready to Optimize?
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of developers using LayerLint to speed up their Docker builds and improve CI/CD efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="https://github.com/vviveksharma/layerLint"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              <FiGithub size={18} />
              Get Started on GitHub
            </motion.a>
            
            <Link to="/docs">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gray-300 text-gray-900 rounded-full font-medium hover:border-gray-400 transition-colors"
              >
                View All Rules
                <FiArrowRight size={18} />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection