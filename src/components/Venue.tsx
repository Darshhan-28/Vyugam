import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const Venue: React.FC = () => {
  return (
    <section id="venue" className="py-24 px-4 bg-venue relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
          Venue Burst
        </span>

        <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-12">
          The Arena Is Set
        </h2>

        {/* Venue Details Card */}
        <div className="bg-carbon-2 border-2 sm:border-4 border-marigold p-5 sm:p-8 md:p-12 shadow-[6px_6px_0_#7A0606] sm:shadow-[8px_8px_0_#7A0606] max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8 mb-6 sm:mb-8 text-center sm:text-left">
            <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
              <div className="p-2.5 sm:p-3 bg-carbon border border-marigold rounded-full flex-shrink-0">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-marigold" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-smoke uppercase">24-09-2026</h3>
                <p className="font-mono text-[11px] sm:text-xs text-mustard uppercase tracking-wider">Thursday</p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 justify-center sm:justify-start">
              <div className="p-2.5 sm:p-3 bg-carbon border border-marigold rounded-full flex-shrink-0">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-marigold" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-smoke uppercase">9:00 AM - 5:00 PM</h3>
                <p className="font-mono text-[11px] sm:text-xs text-mustard uppercase tracking-wider">Full Day Event</p>
              </div>
            </div>
          </div>

          <div className="h-0.5 bg-marigold/40 my-4 sm:my-6" />

          <div className="flex items-start gap-3 sm:gap-4 text-left">
            <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-marigold flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-heading font-extrabold text-base sm:text-xl text-marigold uppercase">
                IT Department Block, P.A. College of Engineering and Technology
              </h4>
              <p className="font-body text-xs sm:text-base text-cream/90 mt-1 leading-relaxed">
                Pollachi, Coimbatore &ndash; 642002, Tamil Nadu.<br />
                Easily reachable from Coimbatore city and Pollachi bus stand — parking available on campus.
              </p>
            </div>
          </div>

          {/* Interactive Google Maps Embed */}
          <div className="mt-6 sm:mt-8 border-2 border-marigold shadow-[4px_4px_0_#7A0606] sm:shadow-[5px_5px_0_#7A0606] overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.7109784687345!2d77.0311864751889!3d10.679527289463385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8379603118171%3A0xaabce92d2cdd4e50!2sP.%20A.%20College%20of%20Engineering%20and%20Technology%20(Autonomous)%2C%20Pollachi%2C%20Coimbatore!5e0!3m2!1sen!2sin!4v1770970402480!5m2!1sen!2sin"
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="PACET College Location Map"
              className="sm:h-[320px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
