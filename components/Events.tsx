'use client'

import { useState } from 'react'
import EventRegistrationModal from '@/components/EventRegistrationModal'

interface Event {
  id: number
  title: string
  subtitle: string
  description: string
  teamSize: number
  rules: string[]
  specialNote?: string
  googleSheetScriptUrl: string
}

const events: Event[] = [
  {
    id: 1,
    title: 'Insight Arena',
    subtitle: 'Paper Presentation',
    description: 'Present your innovative research and technical insights to showcase your ideas and expertise.',
    teamSize: 4,
    rules: [
      'Teams should consist of 4 members',
      'Technical content is mandatory',
      'Presentation time: 10 minutes + 5 minutes Q&A',
      'PowerPoint or PDF presentations allowed',
      'Original research or case studies preferred',
      'All team members must register and attend',
    ],
    specialNote: 'Paper must be sent to viyugam2k26@gmail.com on or before February 25, 2026',
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbxyE12Qh7El9qnH69cuhKt_2GiFSJ1Ccm6JLNGFZrOauwGzn6RtbMlmzpMkCodc8GZ0zQ/exec',
  },
  {
    id: 2,
    title: 'BrainBlitz',
    subtitle: 'Quiz',
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
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbxyE12Qh7El9qnH69cuhKt_2GiFSJ1Ccm6JLNGFZrOauwGzn6RtbMlmzpMkCodc8GZ0zQ/exec',
  },
  {
    id: 3,
    title: 'Bug Hunters',
    subtitle: 'CTF Challenge',
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
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbxyE12Qh7El9qnH69cuhKt_2GiFSJ1Ccm6JLNGFZrOauwGzn6RtbMlmzpMkCodc8GZ0zQ/exec',
  },
  {
    id: 4,
    title: 'Frontend Fusion',
    subtitle: 'UI/UX Challenge',
    description: 'Design and develop stunning user interfaces with exceptional user experience in this creative challenge.',
    teamSize: 1,
    rules: [
      'Individual participation required',
      'Build responsive web interfaces',
      'HTML, CSS, and JavaScript allowed',
      'Time limit: 3 hours',
      'Use of frameworks like React, Vue is permitted',
      'Creativity and usability are key evaluation criteria',
    ],
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbxyE12Qh7El9qnH69cuhKt_2GiFSJ1Ccm6JLNGFZrOauwGzn6RtbMlmzpMkCodc8GZ0zQ/exec',
  },
  {
    id: 5,
    title: 'Canva Canvas',
    subtitle: 'Poster Design',
    description: 'Create visually stunning and creative posters that convey messages effectively and innovatively.',
    teamSize: 1,
    rules: [
      'Individual participation required',
      'Any design tool can be used (Canva, Photoshop, Illustrator, etc)',
      'Theme will be provided on the day',
      'High resolution submissions (300 DPI) required',
      'Original artwork only',
      'Submission via email before deadline',
    ],
    googleSheetScriptUrl: 'https://script.google.com/macros/s/AKfycbxyE12Qh7El9qnH69cuhKt_2GiFSJ1Ccm6JLNGFZrOauwGzn6RtbMlmzpMkCodc8GZ0zQ/exec',
  },
]

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  return (
    <section id="events" className="relative py-20 px-4 border-b neon-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-primary neon-glow mb-4">
          EVENTS
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Participate in exciting competitions and showcase your technical skills across various domains
        </p>

        {/* Flash Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="group cursor-pointer neon-border rounded-lg p-5 md:p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,150,255,0.4)] hover:border-secondary"
            >
              <div className="space-y-3">
                <div className="h-1 w-8 bg-secondary group-hover:w-12 transition-all duration-300"></div>
                <h3 className="font-heading text-lg md:text-xl font-bold text-primary group-hover:text-secondary transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-xs md:text-sm text-secondary group-hover:text-primary transition-colors font-semibold">
                  {event.subtitle}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {event.description}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-secondary bg-secondary/20 px-2 py-1 rounded font-bold">
                    Team: {event.teamSize}
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
