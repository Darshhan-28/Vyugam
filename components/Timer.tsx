'use client'

import { useState, useEffect } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2026-03-02T00:00:00').getTime()
      const now = new Date().getTime()
      const difference = eventDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div className="w-16 h-16 md:w-20 md:h-20 neon-border rounded-lg flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <span className="font-heading text-2xl md:text-3xl font-bold text-primary neon-glow relative z-10">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider font-heading">
        {label}
      </span>
    </div>
  )

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm md:text-base text-muted-foreground uppercase tracking-wider">
        Event Starts In
      </p>
      <div className="flex gap-2 md:gap-4 justify-center flex-wrap">
        <TimeUnit value={timeLeft.days} label="Days" />
        <div className="text-primary text-2xl md:text-3xl font-bold">:</div>
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <div className="text-primary text-2xl md:text-3xl font-bold">:</div>
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <div className="text-primary text-2xl md:text-3xl font-bold">:</div>
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}
