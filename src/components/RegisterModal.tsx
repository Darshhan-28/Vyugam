import React, { useEffect } from 'react';
import { X, AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

// Redirect link for AIVORA 2K26 symposium
export const AIVORA_REGISTRATION_URL = "https://aivora-2k26.netlify.app/";

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Handle ESC key and prevent body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-obsidian/95 backdrop-blur-md p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      <div className="relative w-full max-w-xl bg-obsidian border-2 sm:border-4 border-red-500 p-5 sm:p-8 shadow-[6px_6px_0_#7A0606] sm:shadow-[10px_10px_0_#7A0606] my-auto max-h-[92vh] overflow-y-auto scrollbar-thin text-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 text-cream hover:text-marigold p-2 font-bold z-10 bg-carbon/90 rounded-full border border-marigold/40 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Closed Alert Badge */}
        <div className="pt-4 sm:pt-2 mb-4 flex justify-center">
          <span className="font-heading font-extrabold text-xs uppercase tracking-widest bg-red-600 text-white px-4 py-1.5 clip-polygon inline-flex items-center gap-1.5 shadow-[3px_3px_0_#050505]">
            <AlertTriangle className="w-4 h-4 text-yellow-300" />
            Registration Closed
          </span>
        </div>

        {/* Title */}
        <h2 id="register-modal-title" className="font-display text-2xl sm:text-4xl text-smoke uppercase tracking-tight mb-2">
          VYUGAM 2.0 REGISTRATION IS CLOSED
        </h2>

        <p className="font-mono text-xs sm:text-sm text-red-400 font-bold tracking-wider uppercase mb-6 bg-red-500/10 border border-red-500/30 p-2.5 rounded">
          Pass registration deadline reached &bull; All entries sealed
        </p>

        <p className="font-body text-sm sm:text-base text-cream/90 max-w-md mx-auto leading-relaxed mb-8">
          Thank you for the overwhelming enthusiasm! Online registration for <span className="text-marigold font-bold">VYUGAM 2.0</span> has officially closed. We look forward to seeing all registered delegates on <span className="text-marigold font-bold">24 September 2026</span>.
        </p>

        {/* AIVORA 2K26 Announcement Card */}
        <div className="bg-carbon border-2 border-marigold p-5 sm:p-6 shadow-[6px_6px_0_#7A0606] relative overflow-hidden text-left mb-6">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-ember via-marigold to-ember" />

          <div className="flex items-center gap-2 text-marigold mb-2">
            <Sparkles className="w-5 h-5 text-marigold animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest font-extrabold text-marigold">
              Looking for Another Event?
            </span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl text-smoke uppercase leading-tight mb-2">
            Register For <span className="text-marigold">AIVORA 2K26</span>!
          </h3>

          <p className="font-body text-xs sm:text-sm text-cream/80 leading-relaxed mb-5">
            Missed out on VYUGAM 2.0? Don&apos;t worry! You can still experience an extraordinary national-level technical symposium by registering for <span className="text-marigold font-bold">AIVORA 2K26</span>.
          </p>

          <a
            href={AIVORA_REGISTRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full font-heading font-extrabold text-sm sm:text-base tracking-wider uppercase text-obsidian bg-marigold border-2 border-obsidian py-3.5 px-4 shadow-[4px_4px_0_#C1121F] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#C1121F] active:translate-y-0 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Register for AIVORA 2K26</span>
            <ExternalLink className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </a>
          <p className="font-mono text-[10px] text-mustard/60 text-center mt-2 uppercase tracking-wider">
            (Click to open AIVORA 2K26 Portal)
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider text-cream/80 hover:text-marigold border border-cream/30 hover:border-marigold px-6 py-2.5 transition-colors"
        >
          Close Window
        </button>
      </div>
    </div>
  );
};
