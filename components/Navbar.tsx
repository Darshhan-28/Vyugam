'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isDark, setIsDark] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'dark'
    setIsDark(theme === 'dark')
    applyTheme(theme === 'dark')
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b neon-border py-4 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand */}
        <Link href="#" className="flex items-center gap-2">
          <span className="font-heading text-xl md:text-2xl font-bold text-primary neon-glow">
            VIYUGAM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors text-sm font-medium"
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
            className="w-10 h-10 rounded-lg neon-border flex items-center justify-center hover:shadow-[0_0_10px_rgba(0,150,255,0.3)] transition-all text-lg"
            aria-label="Toggle theme"
          >
            {isDark ? '🌙' : '☀️'}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1 text-foreground"
            aria-label="Toggle menu"
          >
            <span className="w-5 h-0.5 bg-foreground rounded"></span>
            <span className="w-5 h-0.5 bg-foreground rounded"></span>
            <span className="w-5 h-0.5 bg-foreground rounded"></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-primary/30 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="block text-foreground hover:text-primary transition-colors text-sm font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
