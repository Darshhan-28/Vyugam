import React, { useState, useEffect } from 'react';
import { Menu, X, Zap } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegister }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['hero', 'signal', 'arenas', 'path', 'prizes', 'venue', 'members', 'contact'];
      let current = 'hero';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop - 120;
          if (window.scrollY >= top) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#signal', id: 'signal' },
    { label: 'Events', href: '#arenas', id: 'arenas' },
    { label: 'Schedule', href: '#path', id: 'path' },
    { label: 'Prizes', href: '#prizes', id: 'prizes' },
    { label: 'Venue', href: '#venue', id: 'venue' },
    { label: 'Team', href: '#members', id: 'members' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <>
      {/* Top Accreditation Strip */}
      <div
        className={`fixed top-0 left-0 right-0 z-[501] bg-obsidian border-b border-oxblood transition-transform duration-300 ${
          scrolled ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="flex items-center justify-center gap-2 sm:gap-3 py-1 sm:py-1.5 px-3 sm:px-4 text-[10px] sm:text-xs flex-wrap">
          <span className="font-heading font-extrabold uppercase tracking-widest text-obsidian bg-marigold px-2 sm:px-2.5 py-0.5 clip-polygon">
            Learn
          </span>
          <span className="font-mono text-cream/90 text-[10px] sm:text-[11px] text-center">
            An Autonomous Institution &middot; Accredited by NBA &amp; NAAC with &apos;A&apos; Grade
          </span>
          <span className="font-heading font-extrabold uppercase tracking-widest text-obsidian bg-marigold px-2 sm:px-2.5 py-0.5 clip-polygon">
            Work
          </span>
          <span className="font-mono text-cream/90 text-[10px] sm:text-[11px] hidden sm:inline">
            Pollachi, Coimbatore &ndash; 642002
          </span>
          <span className="font-heading font-extrabold uppercase tracking-widest text-obsidian bg-marigold px-2 sm:px-2.5 py-0.5 clip-polygon">
            Succeed
          </span>
        </div>
      </div>

      {/* Sticky Nav Header */}
      <nav
        className={`fixed left-0 right-0 z-[500] transition-all duration-300 border-b-2 border-marigold backdrop-blur-md bg-obsidian/90 ${
          scrolled ? 'top-0 py-2 sm:py-3 px-4 sm:px-6 md:px-12' : 'top-[28px] sm:top-7 py-2.5 sm:py-4 px-4 sm:px-6 md:px-12'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="font-display text-xl md:text-2xl text-marigold tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-ember inline-block animate-spark clip-spark" />
            VYUGAM 2.0
          </a>

          {/* Desktop Links */}
          <ul className="hidden md:flex items-center gap-6 list-none">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`font-heading font-bold text-sm tracking-widest uppercase transition-colors relative py-1 hover:text-marigold ${
                    activeSection === item.id ? 'text-marigold' : 'text-cream'
                  }`}
                >
                  {item.label}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-marigold animate-pulse" />
                  )}
                </a>
              </li>
            ))}
          </ul>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenRegister}
              className="hidden sm:inline-flex items-center gap-2 font-heading font-bold text-sm tracking-wider uppercase text-obsidian bg-marigold border-2 border-obsidian px-5 py-2 shadow-[3px_3px_0_#C1121F] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#C1121F] active:translate-y-0 transition-all"
            >
              <Zap className="w-4 h-4 fill-current text-obsidian" />
              Register Free
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-marigold p-1.5 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-obsidian border-b-2 border-marigold p-6 flex flex-col gap-4 shadow-2xl animate-fadeIn">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`font-heading font-bold text-base tracking-widest uppercase py-2 border-b border-carbon ${
                  activeSection === item.id ? 'text-marigold' : 'text-cream'
                }`}
              >
                {item.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenRegister();
              }}
              className="w-full mt-2 font-heading font-extrabold text-base tracking-wider uppercase text-obsidian bg-marigold border-2 border-obsidian py-3 shadow-[4px_4px_0_#C1121F]"
            >
              ⚡ Register Free Now
            </button>
          </div>
        )}
      </nav>
    </>
  );
};
