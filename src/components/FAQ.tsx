import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How much is the VYUGAM Pass?',
    a: 'The VYUGAM Symposium Pass is ₹200. One pass. Full symposium access.',
  },
  {
    q: 'Do I need to register separately for every event?',
    a: 'No. You purchase one VYUGAM Pass for the symposium. Event participation follows the individual rules and team requirements of each arena — no separate registrations or payments.',
  },
  {
    q: 'How do I pay?',
    a: 'Payment is made through the official UPI / Google Pay QR provided during the registration process. Scan, pay ₹200, and upload your payment screenshot.',
  },
  {
    q: 'When will I receive my pass?',
    a: 'After your payment proof is manually verified by the VYUGAM team, your personalized VYUGAM Pass will be sent to your registered email address.',
  },
  {
    q: 'What should I bring on the event day?',
    a: 'Keep your personalized VYUGAM Pass accessible on your phone. Your unique QR code will be scanned by event coordinators before you enter participating arenas.',
  },
  {
    q: 'Can I participate in multiple events?',
    a: 'Yes. Your VYUGAM Pass is designed for the complete symposium experience. Individual arenas may have their own team-size, timing, and participation rules — check each arena\'s details.',
  },
  {
    q: 'How do I get my pass after payment?',
    a: '1. Register for VYUGAM and fill in your details.\n2. Pay ₹200 through the UPI QR provided.\n3. Upload your payment screenshot.\n4. Wait for manual verification by the VYUGAM team.\n5. Receive your personalized VYUGAM Pass by email.\n6. Save it on your phone and bring it to the symposium.',
  },
];

export const FAQ: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-24 px-4 bg-signal relative overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-6">
            FAQ
          </span>
          <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-3">
            Got Questions?
          </h2>
          <p className="font-body text-base text-cream/70">
            Everything you need to know about the VYUGAM Pass.
          </p>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`border-2 transition-all ${
                openIdx === idx ? 'border-marigold shadow-[4px_4px_0_#7A0606]' : 'border-carbon-2 hover:border-marigold/50'
              } bg-carbon`}
            >
              <button
                id={`faq-item-${idx}`}
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                aria-expanded={openIdx === idx}
              >
                <span className={`font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider transition-colors ${
                  openIdx === idx ? 'text-marigold' : 'text-smoke'
                }`}>
                  {item.q}
                </span>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 text-marigold transition-transform duration-300 ${
                    openIdx === idx ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-marigold/20">
                  {item.a.includes('\n') ? (
                    <ol className="font-body text-sm text-cream/80 leading-relaxed mt-3 space-y-1">
                      {item.a.split('\n').map((line, li) => (
                        <li key={li} className="flex items-start gap-2">
                          <span className="text-marigold font-bold flex-shrink-0">{li + 1}.</span>
                          <span>{line.replace(/^\d+\.\s*/, '')}</span>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="font-body text-sm text-cream/80 leading-relaxed mt-3">
                      {item.a}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
