import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiGithub } from 'react-icons/fi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      const sections = ['home', 'features', 'how-it-works', 'demo']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features', id: 'features', isRoute: false },
    { name: 'How It Works', href: '#how-it-works', id: 'how-it-works', isRoute: false },
    { name: 'Demo', href: '#demo', id: 'demo', isRoute: false },
    { name: 'Docs', href: '/docs', id: 'docs', isRoute: true },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/70 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/5' 
            : 'bg-transparent'
        }`}
        style={{
          backdropFilter: scrolled ? 'blur(12px) saturate(180%)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <img src="/favicon.svg" alt="LayerLint" className="w-8 h-8" />
                <span className="text-2xl font-serif font-bold text-gray-900 hover:text-blue-600 transition-colors">LayerLint</span>
              </motion.div>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="relative text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`relative text-sm font-medium transition-colors duration-200 ${
                      activeSection === link.id
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                    {activeSection === link.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-5.25 left-0 right-0 h-0.5 bg-gray-900"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </a>
                )
              ))}
              <a
                href="https://github.com/vviveksharma/layerLint"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <FiGithub className="text-gray-900" size={20} />
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <FiX size={24} className="text-gray-900" /> : <FiMenu size={24} className="text-gray-900" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-white md:hidden pt-20"
        >
          <div className="px-6 py-8 space-y-4">
            {navLinks.map((link) => (
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors py-2"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors py-2"
                >
                  {link.name}
                </a>
              )
            ))}
            <a
              href="https://github.com/vviveksharma/layerLint"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg font-medium text-gray-900 hover:text-gray-600 transition-colors py-2"
            >
              <FiGithub size={20} />
              GitHub
            </a>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default Navbar