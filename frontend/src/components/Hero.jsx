import React from 'react'
import { motion } from 'framer-motion'
import { FiArrowRight, FiGithub, FiZap, FiTrendingUp, FiShield } from 'react-icons/fi'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00f3ff]/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#bf00ff]/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-noise"></div>
      </div>
      
      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#00f3ff] rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5
            }}
            animate={{
              y: [null, -100, -200],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          {/* Neon Badge */}
          <motion.div
            animate={{ 
              boxShadow: ['0 0 0px #00f3ff', '0 0 20px #00f3ff', '0 0 0px #00f3ff']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#00f3ff]/5 border border-[#00f3ff]/30 backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f3ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f3ff]"></span>
            </span>
            <span className="text-[#00f3ff] text-sm font-medium tracking-wider">NOW AVAILABLE — v2.0.0</span>
          </motion.div>

          {/* Main Heading with 3D Effect */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-linear-to-r from-[#00f3ff] via-[#bf00ff] to-[#ff00e5] blur-2xl opacity-50"></span>
              <span className="relative bg-linear-to-r from-[#00f3ff] via-white to-[#ff00e5] bg-clip-text text-transparent animate-gradient">
                Optimize Docker
              </span>
            </span>
            <br />
            <span className="relative inline-block mt-2">
              <span className="text-white">Layer Caching</span>
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            AI-powered static analysis that identifies Docker layer caching anti-patterns. 
            <span className="text-[#00f3ff] font-semibold"> Speed up CI/CD pipelines by 10x</span> with intelligent optimization.
          </p>

          {/* Neon Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {[
              { icon: FiZap, value: '10x', label: 'Faster Builds', color: '#00f3ff' },
              { icon: FiTrendingUp, value: '98%', label: 'Cache Hit Rate', color: '#bf00ff' },
              { icon: FiShield, value: '15+', label: 'Rules', color: '#ff00e5' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff] to-[#bf00ff] rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <stat.icon style={{ color: stat.color }} size={24} />
                  <span className="text-white font-bold text-2xl">{stat.value}</span>
                  <span className="text-gray-400 text-sm">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px #00f3ff' }}
              whileTap={{ scale: 0.95 }}
              href="#demo"
              className="group relative px-8 py-4 rounded-xl font-semibold overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff] to-[#bf00ff]"></div>
              <div className="absolute inset-[1px] bg-[#0a0a0f] rounded-xl"></div>
              <span className="relative text-white flex items-center gap-2">
                Get Started
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="https://github.com/vviveksharma/layerLint"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/5 backdrop-blur-sm rounded-xl text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/10 transition-all border border-white/10"
            >
              <FiGithub size={20} />
              Star on GitHub
            </motion.a>
          </div>

          {/* Modern Terminal Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="mt-20 max-w-5xl mx-auto"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00f3ff] to-[#bf00ff] rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative bg-black/60 backdrop-blur-2xl rounded-2xl border border-[#00f3ff]/30 overflow-hidden">
                <div className="bg-gradient-to-r from-[#00f3ff]/10 to-[#bf00ff]/10 px-4 py-3 flex items-center gap-2 border-b border-white/10">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-gray-400 text-xs ml-2 font-mono">~/layerlint</span>
                  <div className="flex-1"></div>
                  <span className="text-[#00f3ff] text-xs font-mono animate-pulse">● ONLINE</span>
                </div>
                <div className="p-6 font-mono text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <span className="text-white">layerlint scan --dockerfile Dockerfile --ai</span>
                  </div>
                  <div className="text-gray-500 mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-3"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">⚠️</span>
                      <div>
                        <div className="text-yellow-400 font-semibold">Critical Finding Detected</div>
                        <div className="text-cyan-400 ml-4">Rule: dockerfile/broad-copy-before-deps</div>
                        <div className="text-red-400 ml-4">Line 12: COPY . .</div>
                        <div className="text-gray-300 ml-4">
                          Dependency install runs after broad source copy — breaking layer cache
                        </div>
                        <div className="text-green-400 ml-4 mt-1">
                          💡 AI Suggestion: Reorder layers — copy package files first, then install dependencies
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="text-gray-500 mt-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-2 flex items-center gap-2"
                  >
                    <span className="text-green-400">✓</span>
                    <span className="text-green-400">Scan completed: 1 issue found</span>
                    <span className="text-gray-500 text-xs ml-auto">✨ AI-powered analysis</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero