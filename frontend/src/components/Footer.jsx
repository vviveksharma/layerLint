import React from 'react'
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const sections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Rules', href: '#rules' },
        { name: 'Pricing', href: '#' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'GitHub', href: 'https://github.com/vviveksharma/layerLint' },
        { name: 'Examples', href: '#' },
      ]
    },
    {
      title: 'Community',
      links: [
        { name: 'Discord', href: '#' },
        { name: 'Twitter', href: '#' },
        { name: 'Blog', href: '#' },
        { name: 'Contributors', href: '#' },
      ]
    }
  ]

  return (
    <footer className="relative border-t border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00f3ff] to-[#bf00ff] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <div>
                <span className="text-white font-bold text-2xl">LayerLint</span>
                <div className="text-xs text-[#00f3ff]">v2.0.0</div>
              </div>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              AI-powered static analysis tool for Docker layer caching optimization. 
              Speed up CI/CD pipelines by up to 10x.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/vviveksharma/layerLint" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#00f3ff] transition-colors">
                <FiGithub size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00f3ff] transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00f3ff] transition-colors">
                <FiLinkedin size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#00f3ff] transition-colors">
                <FiMail size={20} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-[#00f3ff] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} LayerLint. Made with <FiHeart className="inline text-red-400" size={12} /> for DevOps
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-[#00f3ff] text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-gray-500 hover:text-[#00f3ff] text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-gray-500 hover:text-[#00f3ff] text-sm transition-colors">
              License (MIT)
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer