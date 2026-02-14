'use client'

import { useEffect, useRef } from 'react'

export default function Prizes() {
  const prizes = [
    {
      place: 'FIRST PRIZE',
      icon: '🥇',
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      place: 'SECOND PRIZE',
      icon: '🥈',
      color: 'from-gray-300 to-gray-500',
    },
    {
      place: 'THIRD PRIZE',
      icon: '🥉',
      color: 'from-amber-600 to-amber-800',
    },
  ]

  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          entries[0].target.classList.add('visible')
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="prizes" ref={sectionRef} className="py-20 px-4 border-b neon-border bg-background/50 scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-secondary neon-glow-purple mb-16">
          PRIZE POOL
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prizes.map((prize, idx) => (
            <div
              key={idx}
              className="neon-border-purple rounded-lg p-5 md:p-8 text-center space-y-3 md:space-y-4 transition-all duration-500 hover:shadow-[0_0_30px_rgba(138,43,226,0.3)] group glassmorphism relative overflow-hidden"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Animated Inner Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              <div className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10">
                {prize.icon}
              </div>
              <h3 className="font-heading text-2xl font-bold text-secondary relative z-10">
                {prize.place}
              </h3>
              <p className="text-lg text-primary neon-glow font-bold relative z-10">
                Attractive Prizes
              </p>
              <div className="h-0.5 w-12 bg-secondary mx-auto mt-4 group-hover:w-24 transition-all duration-500 relative z-10"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
