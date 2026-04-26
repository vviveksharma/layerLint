import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import DemoSection from '../components/DemoSection'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import ScrollProgress from '../components/ScrollProgress'
import TerminalTypingDemo from '../components/TerminalTypingDemo'

function Home() {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })

    if (window.location.hash) {
      setTimeout(() => {
        const target = document.querySelector(window.location.hash)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <TerminalTypingDemo />
      <DemoSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default Home
