import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiGithub, FiTerminal, FiGlobe } from 'react-icons/fi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      
      const sections = ['home', 'features', 'how-it-works', 'rules', 'demo']
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
    { name: 'Features', href: '#features', id: 'features' },
    { name: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
    { name: 'Rules', href: '#rules', id: 'rules' },
    { name: 'Demo', href: '#demo', id: 'demo' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#0a0a0f]/80 backdrop-blur-2xl border-b border-[#00f3ff]/20 shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] rounded-xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">L</span>
                </div>
              </div>
              <div>
                <span className="text-white font-bold text-2xl tracking-tight bg-linear-to-r from-white to-[#00f3ff] bg-clip-text">
                  LayerLint
                </span>
                <div className="text-[10px] text-[#00f3ff]/60 tracking-wider">v2.0.0</div>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                    activeSection === link.id
                      ? 'text-[#00f3ff]'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {link.name}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#00f3ff]/10 rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </a>
              ))}
              <div className="w-px h-6 bg-linear-to-b from-transparent via-[#00f3ff]/30 to-transparent mx-4"></div>
              <a
                href="https://github.com/vviveksharma/layerLint"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-white/5 transition-all duration-300 group"
              >
                <FiGithub className="text-gray-400 group-hover:text-[#00f3ff] transition-colors" size={20} />
              </a>
              <a
                href="#demo"
                className="relative px-6 py-2 rounded-lg font-medium text-sm overflow-hidden group"
              >
                <div className="absolute inset-0 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-px bg-[#0a0a0f] rounded-lg"></div>
                <span className="relative text-white group-hover:text-white z-10">Get Started</span>
              </a>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 backdrop-blur-sm text-white border border-white/10"
            >
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        <motion.div
          initial={false}
          animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-[#0a0a0f]/95 backdrop-blur-2xl border-b border-[#00f3ff]/20"
        >
          <div className="py-4 space-y-2 px-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-300 hover:text-[#00f3ff] hover:bg-white/5 rounded-lg transition-all"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 space-y-3">
              <a
                href="https://github.com/vviveksharma/layerLint"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 rounded-lg text-white border border-white/10"
              >
                <FiGithub size={20} />
                <span>GitHub</span>
              </a>
              <a
                href="#demo"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 bg-linear-to-r from-[#00f3ff] to-[#bf00ff] rounded-lg text-white font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  )
}

export default Navbar