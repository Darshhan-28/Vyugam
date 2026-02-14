'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    teamName: '',
    leaderName: '',
    email: '',
    phone: '',
    selectedEvent: '',
    teamMembers: ['', '', ''],
    college: '',
    year: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const events = [
    'Web Development',
    'App Development',
    'AI & Machine Learning',
    'Cybersecurity',
    'Cloud Computing',
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTeamMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.teamMembers]
    newMembers[index] = value
    setFormData((prev) => ({
      ...prev,
      teamMembers: newMembers,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to a server
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        teamName: '',
        leaderName: '',
        email: '',
        phone: '',
        selectedEvent: '',
        teamMembers: ['', '', ''],
        college: '',
        year: '',
      })
    }, 3000)
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-8">
            <Button variant="outline" className="neon-border">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary neon-glow mb-2">
            REGISTER FOR VYUGAM
          </h1>
          <p className="text-muted-foreground">
            Join us for an amazing technical symposium experience
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="mb-8 p-6 neon-border rounded-lg bg-secondary/10">
            <p className="text-center text-secondary font-bold">
              ✓ Registration submitted successfully! We'll contact you soon.
            </p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="neon-border rounded-lg p-8 space-y-8">
          {/* Team Information */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-primary">Team Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 neon-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">
                  Team Leader Name *
                </label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 neon-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 neon-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-primary mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 neon-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          </div>

          {/* Event Selection */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-secondary">Event Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-secondary mb-2">
                  Select Event *
                </label>
                <select
                  name="selectedEvent"
                  value={formData.selectedEvent}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 neon-border-purple rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Choose an event</option>
                  {events.map((event) => (
                    <option key={event} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-secondary mb-2">
                  College/Organization *
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 neon-border-purple rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Your college name"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-primary">Team Members</h2>

            <div className="space-y-4">
              {formData.teamMembers.map((member, index) => (
                <div key={index}>
                  <label className="block text-sm font-bold text-primary mb-2">
                    Member {index + 2} {index === 0 && '(Required)'}
                  </label>
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                    required={index === 0}
                    className="w-full px-4 py-3 neon-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={`Team member ${index + 2} name`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 font-heading bg-primary text-primary-foreground hover:bg-primary/90 py-3 text-base font-bold uppercase tracking-wider"
            >
              Submit Registration
            </Button>
            <Link href="/" className="flex-1">
              <Button
                type="button"
                variant="outline"
                className="w-full font-heading neon-border py-3"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
