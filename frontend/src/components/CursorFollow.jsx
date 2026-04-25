import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const CursorFollow = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  return (
    <>
      <motion.div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 192,
          y: mousePosition.y - 192,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 100,
          mass: 0.5
        }}
        style={{
          background: 'radial-gradient(circle, rgba(0,243,255,0.1) 0%, rgba(191,0,255,0.1) 50%, rgba(255,0,229,0.05) 100%)',
          filter: 'blur(60px)'
        }}
      />
      <motion.div
        className="fixed w-4 h-4 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 800,
          mass: 0.1
        }}
        style={{
          background: 'white',
          boxShadow: '0 0 20px rgba(0,243,255,0.8)'
        }}
      />
    </>
  )
}

export default CursorFollow