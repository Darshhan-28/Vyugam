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
    <footer className="relative border-t neon-border px-4 py-16 md:py-20">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Event Introduction */}
        <div className="text-center space-y-4">
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary neon-glow">
            VYUGAM 2026
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            VYUGAM is the premier technical symposium organized by the Department of Information Technology,
            bringing together innovative minds to showcase their talents and celebrate technical excellence.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            Join us for an unforgettable experience of competition, collaboration, and continuous learning
            in the rapidly evolving world of technology and innovation.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/30"></div>

        {/* Inspirational Quote Section */}
        <div className="text-center space-y-4 py-8">
          <p className="font-heading text-lg md:text-xl text-secondary neon-glow-purple italic">
            &quot;Innovation distinguishes between a leader and a follower.&quot;
          </p>
          <p className="text-muted-foreground text-sm md:text-base">
            — Steve Jobs
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/30"></div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-primary mb-6 neon-glow uppercase text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-heading font-bold text-primary mb-6 neon-glow uppercase text-sm">
              Contact Us
            </h4>
            <div className="space-y-2 text-muted-foreground text-sm md:text-base">
              <p>
                <span className="text-secondary font-bold">Email:</span>
                <a href="mailto:viyugam2k26@gmail.com" className="hover:text-primary transition-colors">
                  {' '}vyugam2k26@gmail.com
                </a>
              </p>
              <p>
                <span className="text-secondary font-bold">Location:</span> Pollachi, Tamil Nadu
              </p>
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="font-heading font-bold text-secondary mb-6 neon-glow-purple uppercase text-sm">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 md:w-12 md:h-12 neon-border rounded-lg flex items-center justify-center hover:shadow-[0_0_15px_rgba(0,150,255,0.3)] transition-all duration-300 hover:border-secondary"
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary/30"></div>

        {/* Copyright */}
        <div className="text-center space-y-3 text-muted-foreground text-xs md:text-sm">
          <p>
            &copy; {currentYear} VYUGAM Technical Symposium. All rights reserved.
          </p>
          <p>
            Organized by Department of{' '}
            <span className="text-primary font-bold neon-glow">
              Information Technology
            </span>
          </p>
          <p className="text-xs">
            ____________________________________________________________
          </p>
        </div>
      </div>
    </footer>
  )
}
