'use client'

export default function Location() {
  return (
    <section id="location" className="relative py-20 px-4 border-b neon-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-primary neon-glow mb-4">
          VENUE & LOGISTICS
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Find us at our state-of-the-art venue in Pollachi with excellent connectivity and facilities
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Venue Info Cards */}
          <div className="space-y-6">
            {/* Timing */}
            <div className="neon-border rounded-lg p-6 md:p-8 hover:shadow-[0_0_15px_rgba(0,150,255,0.2)] transition-all">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl flex-shrink-0">⏰</div>
                <div>
                  <h3 className="font-heading text-lg md:text-xl font-bold text-primary mb-3">
                    Event Timing
                  </h3>
                  <p className="text-foreground mb-2 text-sm md:text-base">
                    <span className="text-secondary font-bold">Date:</span> March 2, 2026
                  </p>
                  <p className="text-foreground text-sm md:text-base">
                    <span className="text-secondary font-bold">Time:</span> 9:00 AM - 6:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="neon-border rounded-lg p-6 md:p-8 hover:shadow-[0_0_15px_rgba(0,150,255,0.2)] transition-all">
              <div className="flex items-start gap-4">
                <div className="text-3xl md:text-4xl flex-shrink-0">📍</div>
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

          {/* Map Section */}
          <div className="neon-border rounded-lg overflow-hidden h-96 md:h-auto md:min-h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.7109784687345!2d77.0311864751889!3d10.679527289463385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8379603118171%3A0xaabce92d2cdd4e50!2sP.%20A.%20College%20of%20Engineering%20and%20Technology%20(Autonomous)%2C%20Pollachi%2C%20Coimbatore!5e0!3m2!1sen!2sin!4v1770970402480!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}
