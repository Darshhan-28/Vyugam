import React from 'react';
import { Ticket, Zap } from 'lucide-react';

interface PassCTAProps {
  onOpenRegister: () => void;
}

export const PassCTA: React.FC<PassCTAProps> = ({ onOpenRegister }) => {
  return (
    <section id="pass-cta" className="py-20 sm:py-28 px-4 bg-arenas border-t-4 border-ember relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-ember/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-ember text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-6">
          Enter The Arena
        </span>

        <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl text-smoke uppercase tracking-tight leading-none mb-4 drop-shadow-hero">
          Ready To
          <br />
          <span className="text-marigold">Enter?</span>
        </h2>

        <p className="font-heading font-extrabold text-lg sm:text-2xl text-smoke uppercase tracking-wide mb-4">
          Get your VYUGAM Pass for ₹200.
        </p>

        <p className="font-body text-sm sm:text-base text-cream/70 max-w-md mx-auto mb-10">
          One registration. One personalized pass. Five+ arenas waiting for you.
        </p>

        {/* Pass visual strip */}
        <div className="flex justify-center mb-10">
          <div className="bg-carbon border-2 border-marigold px-6 sm:px-10 py-4 shadow-[6px_6px_0_#7A0606] relative overflow-hidden max-w-sm w-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-marigold to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mustard">Symposium Pass</p>
                <p className="font-display text-3xl text-marigold leading-none">₹200</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-extrabold text-sm text-smoke uppercase">5+ Arenas</p>
                <p className="font-mono text-[9px] text-cream/40">24 Sept 2026</p>
              </div>
            </div>
          </div>
        </div>

        <button
          id="pass-cta-main-btn"
          onClick={onOpenRegister}
          className="inline-flex items-center gap-3 font-heading font-extrabold text-base sm:text-lg lg:text-xl tracking-wider uppercase text-obsidian bg-marigold border-[3px] border-obsidian px-8 sm:px-12 py-4 sm:py-5 shadow-[6px_6px_0_#C1121F] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0_#C1121F] btn-pulse transition-all"
        >
          <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
          Get My VYUGAM Pass
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
        </button>

        <p className="font-mono text-xs text-cream/40 tracking-wider mt-5 uppercase">
          Payment is made through UPI. Your pass is issued after payment verification.
        </p>
      </div>
    </section>
  );
};
