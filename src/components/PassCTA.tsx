import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';
import { AIVORA_REGISTRATION_URL } from './RegisterModal';

interface PassCTAProps {
  onOpenRegister: () => void;
}

export const PassCTA: React.FC<PassCTAProps> = () => {
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
          Registration
          <br />
          <span className="text-red-500">Closed</span>
        </h2>

        <p className="font-heading font-extrabold text-lg sm:text-2xl text-marigold uppercase tracking-wide mb-4">
          VYUGAM 2.0 Registration is Closed &bull; Register for AIVORA 2K26
        </p>

        <p className="font-body text-sm sm:text-base text-cream/70 max-w-md mx-auto mb-10">
          Missed out on VYUGAM 2.0? You can still participate in an extraordinary national-level technical symposium.
        </p>

        {/* Pass visual strip */}
        <div className="flex justify-center mb-10">
          <div className="bg-carbon border-2 border-red-500 px-6 sm:px-10 py-4 shadow-[6px_6px_0_#7A0606] relative overflow-hidden max-w-sm w-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-400">VYUGAM 2.0 Status</p>
                <p className="font-display text-2xl sm:text-3xl text-red-400 leading-none">CLOSED</p>
              </div>
              <div className="text-right">
                <p className="font-heading font-extrabold text-sm text-marigold uppercase">AIVORA 2K26</p>
                <p className="font-mono text-[9px] text-cream/60">Open For Reg.</p>
              </div>
            </div>
          </div>
        </div>

        <a
          id="pass-cta-main-btn"
          href={AIVORA_REGISTRATION_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 font-heading font-extrabold text-base sm:text-lg lg:text-xl tracking-wider uppercase text-obsidian bg-marigold border-[3px] border-obsidian px-8 sm:px-12 py-4 sm:py-5 shadow-[6px_6px_0_#C1121F] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0_#C1121F] btn-pulse transition-all"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          Register for AIVORA 2K26
          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
        </a>

        <p className="font-mono text-xs text-marigold/70 tracking-wider mt-5 uppercase">
          Click above to visit the official AIVORA 2K26 portal.
        </p>
      </div>
    </section>
  );
};
