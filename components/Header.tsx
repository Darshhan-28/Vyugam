'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import Timer from '@/components/Timer'
import Link from 'next/link'

export default function Header() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headerRef.current) return
      const rect = headerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <header ref={headerRef} className="relative w-full py-12 md:py-16 lg:py-20 px-4 border-b neon-border overflow-hidden mt-20">
      {/* Background tech particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="tech-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              '--tw-translate-x': `${(Math.random() - 0.5) * 200}px`,
              '--tw-translate-y': `${(Math.random() - 0.5) * 200}px`,
              animationDelay: `${Math.random() * 10}s`,
              transform: `scale(${Math.random() * 1.5})`,
            } as any}
          ></div>
        ))}
      </div>

      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-primary/50 to-transparent transform -translate-x-1/2 animate-pulse"
          style={{ transform: `translateX(calc(-50% + ${mousePos.x * 20}px))` }}
        ></div>
        <div
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          style={{ transform: `translateY(${mousePos.y * 30}px)` }}
        ></div>
        <div
          className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"
          style={{ transform: `translateY(${mousePos.y * 50}px)` }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* College Name Container */}
        <div
          className="flex flex-col items-center justify-center gap-2 mb-8 transition-transform duration-300 ease-out"
          style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
        >
          <h1 className="font-heading text-xl md:text-2xl lg:text-4xl font-bold text-primary neon-glow text-center">
            P.A. COLLEGE OF ENGINEERING AND TECHNOLOGY
          </h1>
          <p className="text-sm md:text-lg text-secondary font-semibold">
            (An Autonomous Institution)
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Accredited by NAAC with 'A' Grade
          </p>
          <p className="text-xs md:text-sm text-primary/80 mt-2">
            POLLACHI, COIMBATORE - 642002
          </p>
        </div>

        {/* Department and Symposium Info */}
        <div className="space-y-6 text-center mb-12">
          <p className="text-[10px] sm:text-xs md:text-base text-muted-foreground px-2">
            Department of <span className="text-primary font-bold">INFORMATION TECHNOLOGY</span> Organizes
          </p>

          <div
            className="relative inline-block group transition-transform duration-500 ease-out"
            style={{ transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px) rotateX(${mousePos.y * 10}deg) rotateY(${mousePos.x * -10}deg)` }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative px-6 py-4 bg-background rounded-lg border border-primary/20 neon-pulse">
              <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary to-secondary tracking-widest text-center hover-glitch cursor-default transition-all duration-300">
                VYUGAM
              </h2>
              <div className="mt-4 text-center">
                <p className="font-heading text-[10px] sm:text-xs md:text-sm lg:text-base tracking-[0.2em] md:tracking-[0.4em] text-secondary neon-glow-purple uppercase font-bold opacity-80">
                  Strategic Vision <span className="text-primary mx-1 md:mx-2 animate-pulse">&bull;</span> Intelligent Innovation
                </p>
              </div>
            </div>
          </div>

          {/* About VYUGAM Section */}
          <div
            className="mt-8 max-w-4xl mx-auto space-y-4 transition-transform duration-700 ease-out"
            style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * 15}px)` }}
          >
            <div className="neon-border rounded-lg p-4 md:p-6 glassmorphism">
              <h3 className="font-heading text-lg md:text-xl text-primary neon-glow mb-3">About VYUGAM</h3>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                VYUGAM is a premier technical symposium organized by the Department of Information Technology to showcase innovation, creativity, and technical excellence. It brings together students from across institutions to compete, collaborate, and celebrate technological advancement.
              </p>
            </div>

            <div className="neon-border rounded-lg p-4 md:p-6 glassmorphism">
              <h3 className="font-heading text-lg md:text-xl text-secondary neon-glow-purple mb-3">About IT Department</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                The Department of Information Technology at P.A. College of Engineering is committed to fostering technical expertise and innovation. We provide a platform for students to develop cutting-edge solutions and build industry-ready skills through practical hands-on experiences and collaborative projects.
              </p>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="mb-12 neon-border rounded-lg p-6 md:p-8">
          <Timer />
        </div>

        {/* Registration Button */}
        <div className="flex justify-center">
          <Link href="#events">
            <Button
              size="lg"
              className="font-heading bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-bold uppercase tracking-wider transition-all duration-300 hover:tracking-[0.2em] hover:shadow-[0_0_30px_rgba(0,150,255,0.4)]"
            >
              View Events & Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
