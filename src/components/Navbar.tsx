import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Ticket, Zap, Clock } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegister }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const embersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  }, []);

  useEffect(() => {
    const container = embersRef.current;
    if (!container) return;
    for (let i = 0; i < 26; i++) {
      const el = document.createElement('div');
      el.className = 'ember-particle';
      const size = 2 + Math.random() * 3;
      el.style.width = size + 'px';
      el.style.height = size + 'px';
      el.style.left = Math.random() * 100 + '%';
      el.style.bottom = Math.random() * 30 + '%';
      el.style.animationDuration = (5 + Math.random() * 6) + 's';
      el.style.animationDelay = (Math.random() * 8) + 's';
      container.appendChild(el);
    }
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <header id="hero" className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden hero-bg pb-16 sm:pb-20">
      <div className="hero-streaks-bg" />
      <div className="hero-vignette" />
      <div className="hero-frame" />

      <div className="starburst-wrap">
        <svg className="w-full h-full animate-burst" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="burstGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#FDB515"/>
              <stop offset="55%" stopColor="#FF4A12"/>
              <stop offset="100%" stopColor="#C1121F"/>
            </radialGradient>
          </defs>
          <polygon points="300,10 330,180 460,70 380,220 580,210 400,290 560,400 370,350 420,540 300,380 180,540 230,350 40,400 200,290 20,210 220,220 140,70 270,180"
            fill="url(#burstGrad)" stroke="#050505" strokeWidth="6" strokeLinejoin="round"/>
          <polygon points="300,80 320,200 410,120 355,240 500,235 370,290 480,370 340,335 375,470 300,350 225,470 260,335 120,370 230,290 100,235 245,240 190,120 280,200"
            fill="none" stroke="#F5E6B8" strokeWidth="2" opacity="0.5"/>
        </svg>
      </div>

      <div className="embers" ref={embersRef} />

      <svg className="megaphone megaphone-left" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L70 40 L70 120 L10 90 Z" fill="#C1121F" stroke="#050505" strokeWidth="4"/>
        <path d="M70 40 L150 10 L150 150 L70 120 Z" fill="#7A0606" stroke="#050505" strokeWidth="4"/>
        <rect x="0" y="72" width="14" height="16" fill="#101010"/>
        <g stroke="#FDB515" strokeWidth="3" opacity="0.85">
          <path d="M155 45 L185 25"/><path d="M160 70 L195 65"/><path d="M155 115 L185 130"/>
        </g>
      </svg>
      <svg className="megaphone megaphone-right" viewBox="0 0 200 160" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 70 L70 40 L70 120 L10 90 Z" fill="#C1121F" stroke="#050505" strokeWidth="4"/>
        <path d="M70 40 L150 10 L150 150 L70 120 Z" fill="#7A0606" stroke="#050505" strokeWidth="4"/>
        <rect x="0" y="72" width="14" height="16" fill="#101010"/>
        <g stroke="#FDB515" strokeWidth="3" opacity="0.85">
          <path d="M155 45 L185 25"/><path d="M160 70 L195 65"/><path d="M155 115 L185 130"/>
        </g>
      </svg>

      <div className="relative z-30 w-full max-w-5xl mx-auto flex flex-col items-center text-center pt-[90px] sm:pt-[88px] md:pt-[90px] px-4">
        <div className="flex gap-3 mb-4 flex-wrap justify-center">
          {['Learn', 'Work', 'Succeed'].map((t) => (
            <span key={t} className="font-heading font-extrabold text-xs uppercase tracking-widest bg-marigold text-obsidian px-4 py-1 clip-polygon">
              {t}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 my-3 w-full">
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-full border-2 border-marigold bg-white shadow-[0_0_15px_rgba(253,181,21,0.6)] hover:scale-105 transition-transform duration-300">
              <img
                src="/pacet-logo-nobg.png"
                alt="P.A. College of Engineering and Technology Logo"
                width="96"
                height="96"
                decoding="async"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="sm:hidden w-16 h-16 xs:w-20 xs:h-20 flex-shrink-0 rounded-full border-2 border-marigold bg-white shadow-[0_0_15px_rgba(253,181,21,0.6)] hover:scale-105 transition-transform duration-300">
              <img
                src="/it-dept-logo.png"
                alt="Department of Information Technology Logo"
                width="96"
                height="96"
                decoding="async"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
          </div>
          <div className="text-center px-2">
            <div className="font-heading font-extrabold text-lg xs:text-xl sm:text-2xl lg:text-3xl text-smoke uppercase tracking-tight leading-tight">
              P.A. College of Engineering<br className="hidden sm:inline" /> and Technology
            </div>
            <div className="font-body text-[11px] xs:text-xs sm:text-sm text-cream mt-1">
              An Autonomous Institution (Accredited by NBA and NAAC with 'A' Grade)
            </div>
          </div>
          <div className="hidden sm:flex w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-full border-2 border-marigold bg-white shadow-[0_0_20px_rgba(253,181,21,0.6)] hover:scale-105 transition-transform duration-300">
            <img
              src="/it-dept-logo.png"
              alt="Department of Information Technology Logo"
              width="96"
              height="96"
              decoding="async"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 font-mono text-[11px] sm:text-sm text-marigold tracking-wider mt-1">
          <MapPin className="w-3.5 h-3.5 text-marigold flex-shrink-0" />
          Pollachi, Coimbatore &ndash; 642002
        </div>
        <div className="mt-2 font-heading font-bold text-xs sm:text-sm tracking-widest uppercase text-smoke flex items-center gap-2 sm:gap-3">
          <span className="w-4 sm:w-8 h-px bg-marigold" />
          Department of Information Technology
          <span className="w-4 sm:w-8 h-px bg-marigold" />
        </div>
      </div>

      <div className="relative z-30 flex flex-col items-center text-center mt-5 sm:mt-6 max-w-4xl px-4 w-full">
        <span className="font-heading font-extrabold italic tracking-widest uppercase text-xs sm:text-sm bg-marigold text-oxblood px-5 sm:px-6 py-1 sm:py-1.5 mb-1 clip-polygon">
          Presents
        </span>

        <h1 className="font-display text-[2.2rem] xs:text-5xl sm:text-7xl lg:text-9xl text-crimson uppercase leading-none stroke-gold drop-shadow-hero break-words w-full">
          VYUGAM 2.0
          <span className="block font-heading font-extrabold italic text-base xs:text-lg sm:text-xl lg:text-2xl text-marigold tracking-wider mt-2 sm:mt-3 stroke-none leading-tight" style={{ textShadow: 'none' }}>
            ONE PASS.&nbsp; 5+ EVENTS.&nbsp; ONE FULL-DAY EXPERIENCE.
          </span>
        </h1>

        <p className="font-body text-xs sm:text-base lg:text-lg text-cream max-w-2xl mt-4 sm:mt-6 leading-relaxed px-2">
          A national-level technical symposium where code, logic, design, research, creativity, and competition collide.
          Register for aivora and experience the full event.
        </p>

        <div className="flex flex-wrap gap-2.5 sm:gap-4 justify-center mt-6 sm:mt-8 w-full">
          <div className="badge-tilt-1 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider bg-carbon text-smoke border-2 border-marigold px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ember flex-shrink-0" /> 24 September 2026
          </div>
          <div className="badge-tilt-2 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider bg-carbon text-smoke border-2 border-marigold px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-ember flex-shrink-0" /> IT Department Block
          </div>
          <div className="badge-tilt-3 font-heading font-bold text-xs sm:text-sm uppercase tracking-wider bg-carbon text-marigold border-2 border-ember px-3.5 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2">
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-marigold flex-shrink-0" /> Register for aivora
          </div>
        </div>

        <div className="mt-6 sm:mt-8 w-full max-w-xl sm:max-w-2xl">
          <div className="bg-carbon/85 border-2 border-marigold p-3 sm:p-5 shadow-[5px_5px_0_#7A0606] flex flex-col items-center justify-center gap-2">
            <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-marigold flex items-center gap-1.5 font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" /> Event Countdown
            </span>
            <div className="flex gap-1.5 sm:gap-2.5 justify-center w-full">
              {[
                { label: 'Days', val: timeLeft.days },
                { label: 'Hours', val: timeLeft.hours },
                { label: 'Mins', val: timeLeft.minutes },
                { label: 'Secs', val: timeLeft.seconds },
              ].map((u) => (
                <div key={u.label} className="flex flex-col items-center flex-1 min-w-[36px] xs:min-w-[44px]">
                  <div className="font-display text-lg xs:text-xl sm:text-2xl text-smoke bg-obsidian border border-marigold py-1 px-1 w-full text-center shadow-[2px_2px_0_#C1121F]">
                    {pad(u.val)}
                  </div>
                  <span className="font-heading font-bold text-[8px] xs:text-[9px] uppercase text-mustard mt-1 tracking-wider">
                    {u.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 justify-center mt-6 sm:mt-8 w-full px-2 sm:px-0">
          <button
            id="hero-pass-cta"
            onClick={onOpenRegister}
            className="font-heading font-extrabold text-sm sm:text-base lg:text-lg tracking-wider uppercase text-obsidian bg-marigold border-[3px] border-obsidian px-6 sm:px-8 py-3.5 sm:py-4 shadow-[5px_5px_0_#C1121F] hover:-translate-y-0.5 transition-all"
          >
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-2" />
            Register for aivora
          </button>
          <a
            href="#arenas"
            className="font-heading font-bold text-sm sm:text-base lg:text-lg tracking-wider uppercase text-marigold bg-transparent border-[3px] border-marigold px-6 sm:px-8 py-3.5 sm:py-4 hover:bg-marigold hover:text-obsidian transition-all"
          >
            Explore The Arenas
          </a>
        </div>

        <p className="font-mono text-xs sm:text-sm text-mustard/70 tracking-widest uppercase mt-4">
          One pass. Multiple arenas. Zero confusion.
        </p>
      </div>

      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5">
        <span className="font-mono text-[11px] tracking-widest text-marigold">SCROLL</span>
        <span className="scroll-cue-chevron" />
      </div>
    </header>
  );
};
