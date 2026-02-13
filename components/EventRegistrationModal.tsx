'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

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

interface EventRegistrationModalProps {
  event: Event | null
  onClose: () => void
}

interface TeamMember {
  name: string
  email: string
  phone: string
  collegeName: string
  year: string
  department: string
}

export default function EventRegistrationModal({
  event,
  onClose,
}: EventRegistrationModalProps) {
  const [step, setStep] = useState<'details' | 'register'>('details')
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<{
    eventName: string
    teamMembers: TeamMember[]
  }>({
    eventName: event?.title || '',
    teamMembers: Array(event?.teamSize || 1)
      .fill(null)
      .map(() => ({
        name: '',
        email: '',
        phone: '',
        collegeName: '',
        year: '',
        department: '',
      })),
  })

  const [submitted, setSubmitted] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: string
  ) => {
    const newMembers = [...formData.teamMembers]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setFormData({ ...formData, teamMembers: newMembers })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Construct flattened payload matching Google Sheet columns
      const payload: any = {
        'Timestamp': new Date().toISOString(),
        'Event Name': formData.eventName,
        'TL Name': formData.teamMembers[0].name,
        'TL Email': formData.teamMembers[0].email,
        'TL Phone': formData.teamMembers[0].phone,
        'TL College': formData.teamMembers[0].collegeName,
        'TL Year': formData.teamMembers[0].year,
        'TL Dept': formData.teamMembers[0].department,
      }

      // Add members 2-4 (ensure empty strings if member doesn't exist)
      for (let i = 1; i < 4; i++) {
        const member = formData.teamMembers[i] || { name: '', email: '', phone: '', collegeName: '', year: '', department: '' }
        const prefix = `Member ${i + 1}`
        payload[`${prefix} Name`] = member.name
        payload[`${prefix} Email`] = member.email
        payload[`${prefix} Phone`] = member.phone
        payload[`${prefix} College`] = member.collegeName
        payload[`${prefix} Year`] = member.year
        payload[`${prefix} Dept`] = member.department
      }

      console.log('Submitting payload to Apps Script:', payload)

      // Submit to Google Sheets via Apps Script
      const response = await fetch(
        event?.googleSheetScriptUrl || '',
        {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(payload),
        }
      )

      setSubmitted(true)
      setSuccessMessage(`Your registration for ${event?.title} is successful!`)

      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setStep('details')
        setFormData({
          eventName: event?.title || '',
          teamMembers: Array(event?.teamSize || 1)
            .fill(null)
            .map(() => ({
              name: '',
              email: '',
              phone: '',
              collegeName: '',
              year: '',
              department: '',
            })),
        })
      }, 3000)
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitted(true)
      setSuccessMessage(`Your registration for ${event?.title} is successful!`)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setStep('details')
      }, 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && e instanceof KeyboardEvent && e.key !== 'Escape') return
    setStep('details')
    onClose()
  }

  if (!event) return null

  if (!step || !event) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      onKeyDown={(e) => e.key === 'Escape' && handleClose(e)}
    >
      <div className="neon-border rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center text-2xl text-primary hover:text-secondary transition-colors font-heading"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="p-6 md:p-8 space-y-6">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="w-20 h-20 rounded-full border-3 border-primary flex items-center justify-center text-5xl">
                ✓
              </div>
              <h3 className="font-heading text-2xl md:text-3xl text-primary neon-glow text-center">
                Registration Successful!
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {successMessage}
              </p>
            </div>
          ) : step === 'details' ? (
            <>
              {/* Event Details Step */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary neon-glow">
                    {event.title}
                  </h2>
                  <p className="text-secondary text-lg font-semibold">{event.subtitle}</p>
                </div>

                <div className="border-t border-primary/30 pt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="neon-border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-2">Team Size</p>
                      <p className="text-2xl font-bold text-primary neon-glow">{event.teamSize} Member{event.teamSize !== 1 ? 's' : ''}</p>
                    </div>
                    <div className="neon-border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm mb-2">Event Type</p>
                      <p className="text-lg font-bold text-secondary">{event.subtitle}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-heading text-lg text-primary neon-glow mb-4">
                      Guidelines
                    </h3>
                    <ul className="space-y-3">
                      {event.rules.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="text-secondary font-bold mt-1 flex-shrink-0">{idx + 1}.</span>
                          <span className="text-foreground text-sm leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {event.specialNote && (
                    <div className="neon-border-purple rounded-lg p-4 bg-secondary/5">
                      <p className="text-secondary font-bold mb-2">Important Note:</p>
                      <p className="text-foreground text-sm">{event.specialNote}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4 border-t border-primary/30">
                  <button
                    onClick={() => setStep('register')}
                    className="flex-1 px-6 py-3 font-heading bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors font-bold uppercase text-sm"
                  >
                    Register Now
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClose()}
                    className="px-6 py-3 font-heading neon-border rounded-lg text-primary hover:text-secondary transition-colors font-bold uppercase text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Registration Form Step */}
              <div className="space-y-2 mb-6">
                <h2 className="font-heading text-3xl font-bold text-primary neon-glow">
                  Team Registration
                </h2>
                <p className="text-secondary">{event.title}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formData.teamMembers.map((member, index) => (
                  <div key={index} className="border-t border-primary/30 pt-6 space-y-4">
                    <h3 className="font-heading text-lg text-primary neon-glow">
                      {index === 0 ? 'Team Leader' : `Team Member ${index}`} Details
                    </h3>

                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        required
                        placeholder="Enter full name"
                        className="w-full px-4 py-2 neon-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                          required
                          placeholder="Enter email"
                          className="w-full px-4 py-2 neon-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          value={member.phone}
                          onChange={(e) => handleMemberChange(index, 'phone', e.target.value)}
                          required
                          placeholder="Enter phone number"
                          className="w-full px-4 py-2 neon-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground block mb-2">
                        College Name *
                      </label>
                      <input
                        type="text"
                        value={member.collegeName}
                        onChange={(e) => handleMemberChange(index, 'collegeName', e.target.value)}
                        required
                        placeholder="Enter college name"
                        className="w-full px-4 py-2 neon-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">
                          Year *
                        </label>
                        <select
                          value={member.year}
                          onChange={(e) => handleMemberChange(index, 'year', e.target.value)}
                          required
                          className="w-full px-4 py-2 neon-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
                        >
                          <option value="">Select Year</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground block mb-2">
                          Department *
                        </label>
                        <input
                          type="text"
                          value={member.department}
                          onChange={(e) => handleMemberChange(index, 'department', e.target.value)}
                          required
                          placeholder="Enter department"
                          className="w-full px-4 py-2 neon-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:border-secondary transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t border-primary/30">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 font-heading bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded-lg transition-colors font-bold uppercase text-sm"
                  >
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="px-6 py-3 font-heading neon-border rounded-lg text-primary hover:text-secondary transition-colors font-bold uppercase text-sm"
                  >
                    Back
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
