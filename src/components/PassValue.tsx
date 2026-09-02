import React, { useEffect, useRef } from 'react';
import { Code, HelpCircle, Layout, FileText, Image as ImageIcon, Award, Utensils, Ticket } from 'lucide-react';

interface PassValueProps {
  onOpenRegister: () => void;
}

const BENEFITS = [
  {
    num: '01',
    icon: <Code className="w-7 h-7 text-marigold" />,
    title: '5+ Technical Arenas',
    desc: 'Coding, quizzes, design, research presentation, and visual creativity — all under one roof.',
  },
  {
    num: '02',
    icon: <Ticket className="w-7 h-7 text-marigold" />,
    title: 'One Symposium Pass',
    desc: 'No separate event payments. Get one pass and experience the full VYUGAM symposium.',
  },
  {
    num: '03',
    icon: <HelpCircle className="w-7 h-7 text-marigold" />,
    title: 'Compete & Create',
    desc: 'Challenge yourself across different formats, disciplines, and problem sets in a single day.',
  },
  {
    num: '04',
    icon: <Award className="w-7 h-7 text-marigold" />,
    title: 'Official Certificate',
    desc: 'Receive an official Certificate of Participation — subject to symposium participation requirements.',
  },
  {
    num: '05',
    icon: <Utensils className="w-7 h-7 text-marigold" />,
    title: 'Food & Refreshments',
    desc: 'Complimentary food and refreshments provided to all registered delegates throughout the day.',
  },
  {
    num: '06',
    icon: <ImageIcon className="w-7 h-7 text-marigold" />,
    title: 'Prizes & Recognition',
    desc: 'Compete for cash prizes, trophies, certificates of merit, recognition — and serious bragging rights.',
  },
];

export const PassValue: React.FC<PassValueProps> = ({ onOpenRegister }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    const els = sectionRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="pass-value" ref={sectionRef} className="py-24 px-4 bg-signal border-t-4 border-marigold relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-marigold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-6">
            Your VYUGAM Pass
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-4">
            What Does Your Pass Unlock?
          </h2>
          <p className="font-body text-base sm:text-lg text-cream/80 max-w-xl mx-auto">
            ₹200 gets you the complete VYUGAM experience.
          </p>
        </div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {BENEFITS.map((b) => (
            <div
              key={b.num}
              className="relative bg-obsidian border-2 border-carbon-2 p-7 shadow-[5px_5px_0_#7A0606] hover:-translate-y-1.5 hover:border-marigold hover:shadow-[8px_8px_0_#7A0606] transition-all group overflow-hidden"
            >
              {/* Number accent */}
              <span className="absolute top-3 right-4 font-display text-5xl text-marigold/8 select-none leading-none pointer-events-none group-hover:text-marigold/15 transition-colors">
                {b.num}
              </span>

              <div className="mb-4 group-hover:drop-shadow-[0_0_10px_rgba(253,181,21,0.5)] transition-all">
                {b.icon}
              </div>

              <span className="font-mono text-[10px] uppercase tracking-widest text-ember font-bold mb-1 block">
                {b.num}
              </span>

              <h3 className="font-heading font-extrabold text-lg text-smoke uppercase tracking-wider mb-2">
                {b.title}
              </h3>

              <p className="font-body text-sm text-cream/80 leading-relaxed">
                {b.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14 reveal">
          {/* Pass ticket visual */}
          <div className="inline-block relative mb-8">
            <div className="bg-carbon border-2 border-marigold px-8 sm:px-12 py-5 shadow-[6px_6px_0_#7A0606] relative overflow-hidden">
              {/* Stripe */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-ember via-marigold to-ember" />
              {/* Perforated left edge accent */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-16 border-l-2 border-dashed border-marigold/40" />

              <div className="flex items-center gap-6 sm:gap-10">
                <div className="text-left">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mustard">VYUGAM Symposium Pass</p>
                  <p className="font-display text-4xl sm:text-5xl text-marigold leading-none mt-1">₹200</p>
                </div>
                <div className="w-px h-12 bg-marigold/30" />
                <div className="text-left">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-mustard/70">Access</p>
                  <p className="font-heading font-extrabold text-sm sm:text-base text-smoke uppercase">5+ Arenas</p>
                  <p className="font-mono text-[10px] text-cream/50 mt-0.5">24 Sept 2026 · PACET</p>
                </div>
              </div>
            </div>
          </div>

          <p className="font-body text-sm sm:text-base text-cream/70 max-w-md mx-auto mb-6">
            Five arenas. One symposium. Your pass unlocks it all.
          </p>

          <button
            id="pass-value-cta"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase text-obsidian bg-marigold border-[3px] border-obsidian px-6 sm:px-10 py-3.5 sm:py-4 shadow-[5px_5px_0_#C1121F] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[8px_8px_0_#C1121F] btn-pulse transition-all"
          >
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
            Get Your VYUGAM Pass
          </button>
        </div>
      </div>
    </section>
  );
};
