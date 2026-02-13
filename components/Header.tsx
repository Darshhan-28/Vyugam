'use client'

import { Button } from '@/components/ui/button'
import Timer from '@/components/Timer'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="relative w-full py-16 px-4 border-b neon-border overflow-hidden mt-20">
      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-primary/50 to-transparent transform -translate-x-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* College Name Container */}
        <div className="flex flex-col items-center justify-center gap-2 mb-8">
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-primary neon-glow text-center">
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
          <p className="text-xs md:text-base text-muted-foreground">
            Department of <span className="text-primary font-bold">INFORMATION TECHNOLOGY</span> Organizes
          </p>

          <div className="inline-block px-4 md:px-6 py-3 neon-border-purple rounded-lg">
            <h2 className="font-heading text-3xl md:text-4xl font-black text-secondary neon-glow-purple">
              VIYUGAM
            </h2>
            <p className="text-xs text-secondary/80 mt-2 animate-pulse">
              ▄︻═ Strategic Vision Intelligent Innovation ═︻▄
            </p>
          </div>

          {/* About VIYUGAM Section */}
          <div className="mt-8 max-w-4xl mx-auto space-y-4">
            <div className="neon-border rounded-lg p-4 md:p-6 glassmorphism">
              <h3 className="font-heading text-lg md:text-xl text-primary neon-glow mb-3">About VIYUGAM</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                VIYUGAM is a premier technical symposium organized by the Department of Information Technology to showcase innovation, creativity, and technical excellence. It brings together students from across institutions to compete, collaborate, and celebrate technological advancement.
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
              className="font-heading bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-bold uppercase tracking-wider"
            >
              View Events & Register
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
