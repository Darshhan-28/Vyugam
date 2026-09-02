import React from 'react';
import { QrCode, Smartphone, Shield, Zap } from 'lucide-react';

export const EventDay: React.FC = () => {
  const steps = [
    {
      icon: <Smartphone className="w-6 h-6 text-marigold" />,
      title: 'Keep Your Pass Ready',
      desc: 'Your personalized VYUGAM Pass will be sent to your registered email after payment verification. Save it on your phone.',
    },
    {
      icon: <QrCode className="w-6 h-6 text-marigold" />,
      title: 'QR Code Entry',
      desc: 'Your pass contains a unique QR code. Event coordinators will scan your QR before you enter participating arenas.',
    },
    {
      icon: <Shield className="w-6 h-6 text-marigold" />,
      title: 'One Pass. All Arenas.',
      desc: 'No repeated registration. No separate payments. One pass is your credential for the entire symposium day.',
    },
    {
      icon: <Zap className="w-6 h-6 text-marigold" />,
      title: 'Compete Across Events',
      desc: 'Your pass unlocks participation across the five arenas, subject to each arena\'s team rules and available slots.',
    },
  ];

  return (
    <section id="event-day" className="py-24 px-4 bg-path border-t-4 border-marigold relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-marigold/20 rotate-45" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-marigold/15 rotate-45" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-6">
            Event Day Access
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-3">
            Your Pass. Your Entry.
          </h2>
          <p className="font-body text-base text-cream/70 max-w-lg mx-auto">
            Your personalized VYUGAM Pass contains a unique QR code. Keep it accessible on your phone throughout the symposium.
          </p>
        </div>

        {/* Pass mockup + steps layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Digital pass mockup */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 sm:w-80">
              {/* Pass card */}
              <div className="bg-obsidian border-2 border-marigold shadow-[8px_8px_0_#7A0606] overflow-hidden">
                {/* Header stripe */}
                <div className="bg-gradient-to-r from-oxblood via-ember to-marigold h-2" />

                {/* Pass body */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-mustard">VYUGAM 2.0</p>
                      <p className="font-heading font-extrabold text-sm uppercase text-smoke tracking-wider">Symposium Pass</p>
                    </div>
                    <div className="w-8 h-8 bg-ember clip-spark animate-spark" />
                  </div>

                  {/* Holder */}
                  <div className="border-t border-marigold/30 pt-4 mb-4">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-mustard/60">Pass Holder</p>
                    <p className="font-heading font-extrabold text-base text-smoke uppercase mt-0.5">Your Name Here</p>
                    <p className="font-mono text-[10px] text-cream/50 mt-0.5">Dept · Year · College</p>
                  </div>

                  {/* QR placeholder */}
                  <div className="bg-white p-3 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-0.5">
                      {/* Simplified QR pattern visual */}
                      {[1,1,1,1,1, 1,0,1,0,1, 1,1,0,1,1, 0,1,0,0,1, 1,1,1,0,1].map((v, i) => (
                        <div key={i} className={`${v ? 'bg-obsidian' : 'bg-white'}`} />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-[9px] text-mustard/60 uppercase">Event Date</p>
                      <p className="font-heading font-extrabold text-xs text-marigold uppercase">24 Sept 2026</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] text-mustard/60 uppercase">Venue</p>
                      <p className="font-heading font-extrabold text-xs text-smoke uppercase">IT Block · PACET</p>
                    </div>
                  </div>
                </div>

                {/* Bottom stripe */}
                <div className="bg-marigold/10 border-t border-dashed border-marigold/30 px-6 py-2">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-marigold text-center">One Pass · Five+ Arenas</p>
                </div>
              </div>

              {/* Decorative shadow/glow */}
              <div className="absolute -bottom-3 -right-3 w-full h-full bg-marigold/5 border border-marigold/20 -z-10" />
            </div>
          </div>

          {/* Right: Steps */}
          <div className="flex flex-col gap-6">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="w-12 h-12 flex-shrink-0 bg-carbon border-2 border-marigold/50 flex items-center justify-center group-hover:border-marigold group-hover:shadow-[3px_3px_0_#7A0606] transition-all">
                  {s.icon}
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-smoke uppercase tracking-wider mb-1">
                    {s.title}
                  </h3>
                  <p className="font-body text-sm text-cream/70 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
