import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiLinkedin, FiMail, FiArrowRight } from 'react-icons/fi'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '/#features' },
        { name: 'How It Works', href: '/#how-it-works' },
        { name: 'Demo', href: '/#demo' },
        { name: 'Docs', href: '/docs' },
      ]
    }
  ]

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-serif text-gray-900 mb-4">LayerLint</h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                Static analysis tool for Docker layer caching optimization. 
                Speed up CI/CD pipelines by up to 10x.
              </p>
              
              <div className="flex items-center gap-4 mb-8">
                <a 
                  href="https://github.com/vviveksharma/layerLint" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <FiGithub size={20} />
                  </div>
                  <span className="text-sm font-medium">GitHub</span>
                </a>
                <a 
                  href="https://www.linkedin.com/in/vivek-sharma-207776187/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <FiLinkedin size={20} />
                  </div>
                  <span className="text-sm font-medium">LinkedIn</span>
                </a>
                <a 
                  href="mailto:sharmavivek1709@gmail.com" 
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                    <FiMail size={20} />
                  </div>
                  <span className="text-sm font-medium">Contact</span>
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-8">
            {sections.map((section, idx) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
                  {section.title}
                </h3>
                <ul className="space-y-3.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
                      >
                        <FiArrowRight 
                          size={14} 
                          className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" 
                        />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} LayerLint. MIT License
            </p>
            <span className="text-gray-500 text-sm">
              Made with care for developers
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer