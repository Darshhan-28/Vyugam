'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark'
    setIsDark(theme === 'dark')
    applyTheme(theme === 'dark')

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
      setIsMobileMenuOpen(false)
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchmove', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [])

  const applyTheme = (dark: boolean) => {
    const root = document.documentElement
    if (dark) {
      root.classList.remove('light')
    } else {
      root.classList.add('light')
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    applyTheme(newTheme)
  }

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Events', href: '#events' },
    { label: 'Prizes', href: '#prizes' },
    { label: 'Venue', href: '#location' },
    { label: 'Team', href: '#team' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
      ? 'py-3 px-4 md:px-8 glassmorphism border-b neon-border bg-background/80'
      : 'py-6 px-4 md:px-8 bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="#" className="flex items-center gap-2 group">
          <span className="font-heading text-xl md:text-2xl font-bold text-primary neon-glow group-hover:text-secondary transition-colors duration-300">
            VYUGAM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-medium hover:tracking-widest uppercase"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Theme Toggle and Mobile Menu */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-lg neon-border flex items-center justify-center hover:shadow-[0_0_15px_rgba(0,150,255,0.4)] transition-all text-lg bg-background/50"
            aria-label="Toggle theme"
          >
            <span className={isDark ? 'animate-pulse' : ''}>{isDark ? '🌙' : '☀️'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-foreground relative"
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-primary rounded transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-primary rounded transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-primary rounded transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 mt-4 pt-4 border-t border-primary/30' : 'max-h-0 opacity-0 pointer-events-none'
        }`}>
        <div className="space-y-4 pb-6">
          {navLinks.map((link, index) => (
            <Link
              key={link.label}
              href={link.href}
              className={`block text-foreground/80 hover:text-primary transition-all duration-300 text-sm font-bold py-2 uppercase tracking-widest ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-4'
                }`}
              style={{ transitionDelay: `${index * 50}ms` }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
