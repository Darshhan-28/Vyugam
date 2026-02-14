import { useRef, useEffect } from 'react'

export default function Location() {
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
    <section id="location" ref={sectionRef} className="relative py-20 px-4 border-b neon-border scroll-reveal overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-primary neon-glow mb-4">
          VENUE
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Find us at our state-of-the-art venue in Pollachi with excellent connectivity and facilities
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Venue Info Cards */}
          <div className="space-y-6">
            {/* Timing */}
            <div className="neon-border rounded-lg p-6 md:p-8 hover:shadow-[0_0_20px_rgba(0,150,255,0.2)] transition-all duration-500 opacity-0 -translate-x-8 [.visible_&]:opacity-100 [.visible_&]:translate-x-0 glassmorphism relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">⏰</div>
                <div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-primary mb-3">
                    Event Timing
                  </h3>
                  <p className="text-foreground mb-2 text-sm md:text-base">
                    <span className="text-secondary font-bold">Date:</span> March 2, 2026
                  </p>
                  <p className="text-foreground text-sm md:text-base">
                    <span className="text-secondary font-bold">Time:</span> 9:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="neon-border rounded-lg p-6 md:p-8 hover:shadow-[0_0_20px_rgba(0,150,255,0.2)] transition-all duration-500 opacity-0 -translate-x-8 [.visible_&]:opacity-100 [.visible_&]:translate-x-0 glassmorphism relative overflow-hidden group style={{ transitionDelay: '200ms' }}">
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">📍</div>
                <div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-primary mb-3">
                    Venue
                  </h3>
                  <p className="text-foreground mb-1 font-bold text-sm md:text-base">
                    IT Department Block
                  </p>
                  <p className="text-muted-foreground text-sm md:text-base">
                    P.A. College of Engineering and Technology<br />
                    Pollachi, Tamil Nadu - 642002
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Section with Cyber-Frame */}
          <div className="group relative opacity-0 translate-y-8 [.visible_&]:opacity-100 [.visible_&]:translate-y-0 duration-700 delay-300">
            {/* Cyber Corner Accents */}
            <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-primary group-hover:w-full group-hover:h-full transition-all duration-700 pointer-events-none rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-secondary group-hover:w-full group-hover:h-full transition-all duration-700 pointer-events-none rounded-bl-lg"></div>

            <div className="neon-border rounded-lg overflow-hidden h-96 lg:h-full relative z-10 glassmorphism shadow-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.7109784687345!2d77.0311864751889!3d10.679527289463385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8379603118171%3A0xaabce92d2cdd4e50!2sP.%20A.%20College%20of%20Engineering%20and%20Technology%20(Autonomous)%2C%20Pollachi%2C%20Coimbatore!5e0!3m2!1sen!2sin!4v1770970402480!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(90%)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-60 group-hover:opacity-90 contrast-125 transition-all duration-500 group-hover:grayscale-0 group-hover:invert-0"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border-2 border-primary/20 group-hover:border-primary/40 transition-colors"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
