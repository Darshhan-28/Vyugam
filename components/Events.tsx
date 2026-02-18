'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Calendar, MapPin, Clock, Trophy, MessageCircle, Instagram, Linkedin, Phone } from 'lucide-react'
import EventRegistrationModal from '@/components/EventRegistrationModal'

interface Event {
  id: number
  title: string
  subtitle: string
  tagline: string // Added tagline
  description: string
  teamSize: number
  minTeamSize?: number // Added minTeamSize
  rules: string[]
  specialNote?: string
  googleSheetScriptUrl: string
  contactPhone: string // Added contact phone
}

const events: Event[] = [
  {
    id: 1,
    title: 'Insight Arena',
    subtitle: 'Paper Presentation',
    tagline: 'Present your innovative research and technical insights to showcase your ideas and expertise.', // Added tagline
    description: 'Present your innovative research and technical insights to showcase your ideas and expertise.',
    teamSize: 4,
    minTeamSize: 1,
    rules: [
      'Teams can consist of 1 to 4 members',
      'Technical content is mandatory',
      'Presentation time: 10 minutes + 5 minutes Q&A',
      'PowerPoint or PDF presentations allowed',
      'Original research or case studies preferred',
      'All team members must register and attend',
    ],
    specialNote: 'Paper must be sent to vyugam2k26@gmail.com on or before February 25, 2026',
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbx8pxGgO5ErgkXXg3myukf85ZLhCsw44ed21zi1PgQ56SiVhXAOHm4N7ZBeN9G97CA-UQ/exec',
    contactPhone: '+91 98765 43210',
  },
  {
    id: 2,
    title: 'BrainBlitz',
    subtitle: 'Quiz',
    tagline: 'Test your knowledge across various technical and general topics in an exciting quiz competition.', // Added tagline
    description: 'Test your knowledge across various technical and general topics in an exciting quiz competition.',
    teamSize: 2,
    rules: [
      'Teams can have 2 members',
      'MCQ and descriptive questions included',
      'No external devices or references allowed',
      'Duration: 45 minutes',
      'Top scorers will be recognized',
      'Tie-breaking round if needed',
    ],
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbx8pxGgO5ErgkXXg3myukf85ZLhCsw44ed21zi1PgQ56SiVhXAOHm4N7ZBeN9G97CA-UQ/exec',
    contactPhone: '+91 87654 32109',
  },
  {
    id: 3,
    title: 'Bug Hunters',
    subtitle: 'CTF Challenge',
    tagline: 'Hunt for vulnerabilities and solve security challenges to prove your cybersecurity expertise.', // Added tagline
    description: 'Hunt for vulnerabilities and solve security challenges to prove your cybersecurity expertise.',
    teamSize: 1,
    rules: [
      'Individual participation required',
      'Time limit: 2 hours',
      'Only authorized tools allowed',
      'No DoS attacks or harmful activities',
      'All actions are monitored and logged',
      'Ethical hacking standards must be followed',
    ],
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbx8pxGgO5ErgkXXg3myukf85ZLhCsw44ed21zi1PgQ56SiVhXAOHm4N7ZBeN9G97CA-UQ/exec',
    contactPhone: '+91 76543 21098',
  },
  {
    id: 4,
    title: 'Frontend Fusion',
    subtitle: 'AI Prompting',
    tagline: 'Design and develop stunning user interfaces with exceptional user experience in this creative challenge.', // Added tagline
    description: 'Design and develop stunning user interfaces with exceptional user experience in this creative challenge.',
    teamSize: 1,
    rules: [
      'Individual participation required',
      'Build responsive web interfaces',
      'HTML, CSS, and JavaScript allowed',
      'AI tools must be used for the development',
      'Use of frameworks like React, Vue is permitted',
      'Creativity and usability are key evaluation criteria',
    ],
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbx8pxGgO5ErgkXXg3myukf85ZLhCsw44ed21zi1PgQ56SiVhXAOHm4N7ZBeN9G97CA-UQ/exec',
    contactPhone: '+91 65432 10987',
  },
  {
    id: 5,
    title: 'Canva Canvas',
    subtitle: 'Poster Design',
    tagline: 'Create visually stunning and creative posters that convey messages effectively and innovatively.', // Added tagline
    description: 'Create visually stunning and creative posters that convey messages effectively and innovatively.',
    teamSize: 1,
    rules: [
      'Individual participation required',
      'Any design tool can be used (Canva, Photoshop, Illustrator, etc)',
      'Theme will be provided on the day',
      'High resolution submissions (300 DPI) required',
      'Original artwork only',
      'Designing is done on the Event day',
    ],
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbx8pxGgO5ErgkXXg3myukf85ZLhCsw44ed21zi1PgQ56SiVhXAOHm4N7ZBeN9G97CA-UQ/exec',
    contactPhone: '+91 91234 56789',
  },
]

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
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
    <section id="events" ref={sectionRef} className="relative py-20 px-4 border-b neon-border scroll-reveal">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-primary neon-glow mb-4">
          EVENTS
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Participate in exciting competitions and showcase your technical skills across various domains
        </p>

        <p className="text-center text-red-500 font-bold mb-12 uppercase tracking-[0.2em] animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
          Separate Registrations Required for Every Event
        </p>

        {/* Flash Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="group cursor-pointer neon-border rounded-lg p-5 md:p-6 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,150,255,0.4)] hover:border-secondary glassmorphism relative overflow-hidden"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Tech corner accents */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 group-hover:border-primary/60 transition-colors"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 group-hover:border-primary/60 transition-colors"></div>

              <div className="space-y-3 relative z-10">
                <div className="h-1 w-8 bg-secondary group-hover:w-full transition-all duration-500 ease-out"></div>
                <h3 className="font-heading text-lg md:text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-xs md:text-sm text-secondary group-hover:text-primary transition-colors font-semibold">
                  {event.subtitle}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors">
                  {event.tagline}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-secondary bg-secondary/20 px-2 py-1 rounded font-bold">
                    Team Size: {event.minTeamSize ? `${event.minTeamSize} - ${event.teamSize}` : event.teamSize} Members
                  </span>
                  <span className="text-primary text-lg group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Registration Modal */}
      {/* Event Registration Modal */}
      {selectedEvent && (
        <EventRegistrationModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  )
}
