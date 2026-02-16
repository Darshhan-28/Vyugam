'use client'

import Link from 'next/link'
import { Instagram, MessageCircle, Linkedin } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Events', href: '#events' },
    { label: 'Prizes', href: '#prizes' },
    { label: 'Venue', href: '#location' },
    { label: 'Team', href: '#team' },
  ]

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', url: 'https://www.instagram.com/pacet_castle' },
    { icon: MessageCircle, label: 'Whatsapp', url: 'https://chat.whatsapp.com/LD5VxyGdc5Y4pBwORpozq0' },
    { icon: Linkedin, label: 'LinkedIn', url: 'https://www.linkedin.com/in/pacet-pollachi-5a003a2b7' },
  ]

  return (
    <footer className="relative border-t neon-border px-4 py-20 glassmorphism mt-20 overflow-hidden">
      {/* Footer Cyber Accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 opacity-60"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-secondary/30 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-secondary/30 opacity-60"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 opacity-60"></div>

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Event Introduction */}
        <div className="text-center space-y-6">
          <div className="inline-block relative">
            <h3 className="font-heading text-3xl md:text-5xl font-black text-primary neon-glow tracking-tighter hover-glitch cursor-default">
              VYUGAM 2026
            </h3>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-secondary to-transparent"></div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-lg font-medium">
            VYUGAM is the premier technical symposium organized by the Department of Information Technology,
            bringing together innovative minds to showcase their talents and celebrate technical excellence.
          </p>
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
            ))}
          </div>
        </div>

        {/* Divider with Center Accent */}
        <div className="relative border-t border-primary/20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border border-primary bg-background"></div>
        </div>

        {/* Inspirational Quote Section */}
        <div className="text-center space-y-4 py-8 group">
          <p className="font-heading text-xl md:text-2xl text-secondary neon-glow-purple italic transition-all duration-500 group-hover:tracking-wider">
            &quot;Innovation distinguishes between a leader and a follower.&quot;
          </p>
          <p className="text-muted-foreground text-sm md:text-base font-bold tracking-widest uppercase">
            — Steve Jobs
          </p>
        </div>

        {/* Divider with Center Accent */}
        <div className="relative border-t border-primary/20">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rotate-45 border border-primary bg-background"></div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Quick Links */}
          <div className="group">
            <h4 className="font-heading font-bold text-primary mb-8 neon-glow uppercase text-sm tracking-[0.3em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-primary"></span>
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm md:text-base flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-[1px] bg-primary group-hover/link:w-3 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="group">
            <h4 className="font-heading font-bold text-primary mb-8 neon-glow uppercase text-sm tracking-[0.3em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-primary"></span>
              Contact Us
            </h4>
            <div className="space-y-4 text-muted-foreground text-sm md:text-base">
              <p className="flex items-center gap-3 group/item">
                <span className="text-secondary font-bold min-w-[80px]">Email:</span>
                <a href="mailto:vyugam2k26@gmail.com" className="hover:text-primary transition-colors hover:underline decoration-primary/30 underline-offset-4">
                  vyugam2k26@gmail.com
                </a>
              </p>
              <p className="flex items-center gap-3">
                <span className="text-secondary font-bold min-w-[80px]">Location:</span>
                <span>Pollachi, Tamil Nadu</span>
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div className="group">
            <h4 className="font-heading font-bold text-secondary mb-8 neon-glow-purple uppercase text-sm tracking-[0.3em] flex items-center gap-2">
              <span className="w-4 h-[1px] bg-secondary"></span>
              Follow Us
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 md:w-14 md:h-14 neon-border rounded-xl flex items-center justify-center hover:shadow-[0_0_20px_rgba(0,150,255,0.4)] transition-all duration-500 hover:-translate-y-2 group/social bg-background/40 hover:bg-background/80"
                  title={social.label}
                >
                  <social.icon className="w-6 h-6 transition-transform duration-500 group-hover/social:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/10"></div>

        {/* Copyright Area */}
        <div className="text-center space-y-4 py-4 backdrop-blur-sm bg-primary/5 rounded-2xl border border-primary/10">
          <p className="text-muted-foreground text-xs md:text-sm tracking-wide">
            &copy; {currentYear} <span className="text-primary font-bold">VYUGAM</span> Technical Symposium. All rights reserved.
          </p>
          <p className="text-muted-foreground text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase">
            Organized by Department of{' '}
            <span className="text-primary font-black neon-glow">
              Information Technology
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
