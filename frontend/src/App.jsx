import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import RulesShowcase from './components/RulesShowcase'
import DemoSection from './components/DemoSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'
import CursorFollow from './components/CursorFollow'

function App() {
  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-x-hidden">
      <CursorFollow />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <RulesShowcase />
      <DemoSection />
      <CTASection />
      <Footer />
    </div>
  )
}

export default App