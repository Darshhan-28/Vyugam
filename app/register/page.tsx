'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center space-y-8 neon-border rounded-lg p-12 glassmorphism">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary neon-glow mb-4">
          REGISTRATIONS CLOSED
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed">
          Thank you for your overwhelming response! The registrations for VYUGAM are now officially closed.
          We look forward to seeing the registered participants at the event.
        </p>

        <div className="pt-8">
          <Link href="/">
            <Button size="lg" className="font-heading bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-base font-bold uppercase tracking-wider transition-all duration-300 hover:tracking-[0.2em] hover:shadow-[0_0_30px_rgba(0,150,255,0.4)]">
              ← Return Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
