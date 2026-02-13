'use client'

import Navbar from '@/components/Navbar'
import Header from '@/components/Header'
import Events from '@/components/Events'
import Prizes from '@/components/Prizes'
import Location from '@/components/Location'
import Team from '@/components/Team'
import Footer from '@/components/Footer'
import CircuitBackground from '@/components/CircuitBackground'

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <CircuitBackground />
      <Navbar />
      <div className="relative z-10">
        <Header />
        <Events />
        <Prizes />
        <Location />
        <Team />
        <Footer />
      </div>
    </main>
  )
}
