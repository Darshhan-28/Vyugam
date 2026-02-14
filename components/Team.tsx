'use client'

import { Phone, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'

export default function Team() {
  const teamMembers = [
    {
      name: 'Mr. K.Guru Raaj',
      phone: '+91 80725 49057',
      title: 'Event Coordinator',
      whatsapp: true,
    },
    {
      name: 'Mr. M.Kabilan',
      phone: '+91 75986 82797',
      title: 'Event Coordinator',
      whatsapp: true,
    },
    {
      name: 'Ms. N.Harthika',
      phone: '+91 63697 76459',
      title: 'Event Coordinator',
      whatsapp: true,
    },
    {
      name: 'Ms. S.Madhu Shree',
      phone: '+91 63813 59507',
      title: 'Event Coordinator',
      whatsapp: true,
    },
  ]

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank')
  }

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_blank')
  }

  return (
    <section id="team" className="relative py-20 px-4 border-b neon-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-secondary neon-glow-purple mb-4">
          MEET OUR TEAM
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Connect with our dedicated team members for any queries or assistance
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="neon-border-purple rounded-lg p-5 md:p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] hover:border-primary"
            >
              {/* Avatar Placeholder */}
              <div className="w-14 h-14 md:w-16 md:h-16 neon-border rounded-full mx-auto flex items-center justify-center bg-secondary/10">
                <span className="text-xl md:text-2xl">👤</span>
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-heading font-bold text-primary text-sm md:text-base line-clamp-2">
                  {member.name}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {member.title}
                </p>
              </div>

              {/* Contact Icons */}
              <div className="flex justify-center gap-4 pt-4 border-t border-primary/30">
                {/* Call Icon */}
                <button
                  onClick={() => handleCall(member.phone)}
                  className="p-3 rounded-lg neon-border hover:shadow-[0_0_15px_rgba(0,150,255,0.3)] transition-all text-primary"
                  title="Call"
                >
                  <Phone className="w-5 h-5" />
                </button>

                {/* WhatsApp Icon */}
                <button
                  onClick={() => handleWhatsApp(member.phone)}
                  className="p-3 rounded-lg neon-border-purple hover:shadow-[0_0_15px_rgba(138,43,226,0.3)] transition-all text-secondary"
                  title="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Phone Number */}
              <p className="text-xs text-center text-muted-foreground">
                {member.phone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
