'use client'

interface Coordinator {
  name: string
  phone: string
  event: string
}

interface EventCoordinatorsGroup {
  event: string
  coordinators: Coordinator[]
}

const eventCoordinatorsData: EventCoordinatorsGroup[] = [
  {
    event: 'Insight Arena',
    coordinators: [
      { name: 'K.Guru Raaj', phone: '+91 8072549057', event: 'Insight Arena' },
      { name: 'Rahul Kumar', phone: '+91 98765 43211', event: 'Insight Arena' },
      { name: 'Ananya Singh', phone: '+91 98765 43212', event: 'Insight Arena' },
      { name: 'Vikram Patel', phone: '+91 98765 43213', event: 'Insight Arena' },
    ],
  },
  {
    event: 'BrainBlitz',
    coordinators: [
      { name: 'Aditya Verma', phone: '+91 98765 43220', event: 'BrainBlitz' },
      { name: 'Neha Reddy', phone: '+91 98765 43221', event: 'BrainBlitz' },
      { name: 'Arjun Nair', phone: '+91 98765 43222', event: 'BrainBlitz' },
      { name: 'Divya Malhotra', phone: '+91 98765 43223', event: 'BrainBlitz' },
    ],
  },
  {
    event: 'Bug Hunters',
    coordinators: [
      { name: 'Rohan Singh', phone: '+91 98765 43230', event: 'Bug Hunters' },
      { name: 'Sneha Gupta', phone: '+91 98765 43231', event: 'Bug Hunters' },
      { name: 'Harsh Pandey', phone: '+91 98765 43232', event: 'Bug Hunters' },
      { name: 'Isha Kapoor', phone: '+91 98765 43233', event: 'Bug Hunters' },
    ],
  },
  {
    event: 'Frontend Fusion',
    coordinators: [
      { name: 'Akshay Desai', phone: '+91 98765 43240', event: 'Frontend Fusion' },
      { name: 'Pooja Joshi', phone: '+91 98765 43241', event: 'Frontend Fusion' },
      { name: 'Dev Chakraborty', phone: '+91 98765 43242', event: 'Frontend Fusion' },
      { name: 'Zara Khan', phone: '+91 98765 43243', event: 'Frontend Fusion' },
    ],
  },
  {
    event: 'Canva Canvas',
    coordinators: [
      { name: 'Shreya Saxena', phone: '+91 98765 43250', event: 'Canva Canvas' },
      { name: 'Aman Bhatt', phone: '+91 98765 43251', event: 'Canva Canvas' },
      { name: 'Priyanka Rao', phone: '+91 98765 43252', event: 'Canva Canvas' },
      { name: 'Nikhil Menon', phone: '+91 98765 43253', event: 'Canva Canvas' },
    ],
  },
]

export default function EventCoordinators() {
  return (
    <section id="coordinators" className="relative py-20 px-4 border-b neon-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-secondary neon-glow-purple mb-4">
          EVENT COORDINATORS
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Contact our coordinators for any queries related to your event
        </p>

        <div className="space-y-12">
          {eventCoordinatorsData.map((group) => (
            <div key={group.event}>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary neon-glow mb-6 text-center md:text-left">
                {group.event}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {group.coordinators.map((coordinator, idx) => (
                  <div
                    key={idx}
                    className="neon-border rounded-lg p-5 md:p-6 space-y-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 neon-border rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                        <span className="text-lg">👤</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-primary text-sm md:text-base truncate">
                          {coordinator.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          Coordinator
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-primary/30 pt-4">
                      <div className="flex items-center gap-3">
                        <a
                          href={`tel:${coordinator.phone}`}
                          className="flex items-center gap-2 text-xs md:text-sm text-primary hover:text-secondary transition-colors flex-1"
                          title="Call"
                        >
                          <span className="text-lg">📞</span>
                          <span className="truncate">{coordinator.phone}</span>
                        </a>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={`tel:${coordinator.phone}`}
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 neon-border rounded text-xs text-primary hover:text-secondary hover:shadow-[0_0_10px_rgba(0,150,255,0.3)] transition-all"
                          title="Call"
                        >
                          <span>📞</span>
                          <span className="hidden sm:inline">Call</span>
                        </a>
                        <a
                          href={`https://wa.me/${coordinator.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1 px-3 py-2 neon-border-purple rounded text-xs text-secondary hover:text-primary hover:shadow-[0_0_10px_rgba(138,43,226,0.3)] transition-all"
                          title="WhatsApp"
                        >
                          <span>💬</span>
                          <span className="hidden sm:inline">WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
