import React from 'react';
import { Phone, Mail, Instagram, MessageCircle, Linkedin, Code, Ticket } from 'lucide-react';

interface FooterProps {
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenRegister }) => {
  return (
    <footer id="contact" className="py-20 px-4 bg-signal border-t-4 border-marigold relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
          Need Help?
        </span>

        <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-4">
          Need Help With Your Pass?
        </h2>

        <p className="font-body text-base text-cream/90 max-w-xl mx-auto mb-12">
          Ask us about pass registration, payment verification, event participation, team requirements, or event-day access — we'll get back fast.
        </p>

        {/* Contact Chips */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 text-left mb-12">
          <a
            href="https://wa.me/917558108034"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-carbon border-2 border-mustard p-4 hover:border-marigold transition-all group"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-marigold block mb-1">
              Mr. H. Abhilash
            </span>
            <div className="font-body font-semibold text-smoke text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-marigold" /> 7558108034
            </div>
          </a>

          <a
            href="https://wa.me/916381359507"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-carbon border-2 border-mustard p-4 hover:border-marigold transition-all group"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-marigold block mb-1">
              Ms. S. Madhusree
            </span>
            <div className="font-body font-semibold text-smoke text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-marigold" /> 6381359507
            </div>
          </a>

          <a
            href="https://wa.me/918610234748"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-carbon border-2 border-mustard p-4 hover:border-marigold transition-all group"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-marigold block mb-1">
              Mr. S. Oviyan
            </span>
            <div className="font-body font-semibold text-smoke text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-marigold" /> 8610234748
            </div>
          </a>

          <a
            href="https://wa.me/917598682797"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-carbon border-2 border-mustard p-4 hover:border-marigold transition-all group"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-marigold block mb-1">
              Mr. M. Kabilan
            </span>
            <div className="font-body font-semibold text-smoke text-sm flex items-center gap-2">
              <Phone className="w-4 h-4 text-marigold" /> 7598682797
            </div>
          </a>

          <a
            href="mailto:Vyugam2k262.0@gmail.com"
            className="bg-carbon border-2 border-mustard p-4 hover:border-marigold transition-all group col-span-1 xs:col-span-2 lg:col-span-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-marigold block mb-1">
              Official Email
            </span>
            <div className="font-body font-semibold text-smoke text-xs flex items-center gap-2 break-all">
              <Mail className="w-4 h-4 text-marigold flex-shrink-0" /> Vyugam2k262.0@gmail.com
            </div>
          </a>
        </div>

        {/* Steve Jobs Quote */}
        <div className="my-8 sm:my-10 py-6 border-y border-marigold/20">
          <p className="font-heading italic text-lg sm:text-xl md:text-2xl text-marigold tracking-wide px-2">
            &quot;Innovation distinguishes between a leader and a follower.&quot;
          </p>
          <p className="font-mono text-xs uppercase tracking-widest text-mustard mt-2">
            — Steve Jobs
          </p>
        </div>

        {/* Social Chips */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 sm:mb-12">
          <a
            href="https://www.instagram.com/pacet_castle"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider bg-carbon text-cream border-2 border-marigold px-5 py-2.5 shadow-[3px_3px_0_#7A0606] hover:bg-marigold hover:text-obsidian hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" /> Instagram @pacet_castle
          </a>

          <a
            href="https://chat.whatsapp.com/Iqlfm4bwioV1QYaPjAqVMy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider bg-carbon text-cream border-2 border-emerald-500/80 px-5 py-2.5 shadow-[3px_3px_0_#7A0606] hover:bg-emerald-500 hover:text-obsidian hover:-translate-y-0.5 transition-all flex items-center gap-2 group"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:text-obsidian transition-colors" />
            Join Our WhatsApp Group
          </a>

          <a
            href="https://www.linkedin.com/in/pacet-pollachi-5a003a2b7"
            target="_blank"
            rel="noopener noreferrer"
            className="font-heading font-bold text-xs sm:text-sm uppercase tracking-wider bg-carbon text-cream border-2 border-marigold px-5 py-2.5 shadow-[3px_3px_0_#7A0606] hover:bg-marigold hover:text-obsidian hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <Linkedin className="w-4 h-4 text-blue-400" /> LinkedIn PACET
          </a>
        </div>

        {/* Final CTA */}
        <div className="py-10 border-y border-marigold/20 mb-10">
          <div className="font-display text-3xl sm:text-4xl text-smoke uppercase leading-tight mb-2">
            ONE PASS.
          </div>
          <div className="font-display text-3xl sm:text-4xl text-marigold uppercase leading-tight mb-2">
            FIVE+ ARENAS.
          </div>
          <div className="font-display text-3xl sm:text-4xl text-smoke uppercase leading-tight mb-6">
            ONE DAY TO MAKE YOUR MARK.
          </div>

          <p className="font-heading font-bold text-sm sm:text-base uppercase tracking-wider text-cream/60 mb-6">
            Get your pass. Enter the arena.
          </p>

          <button
            id="footer-pass-cta"
            onClick={onOpenRegister}
            className="inline-flex items-center gap-2 font-heading font-extrabold text-sm sm:text-base uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian px-8 py-3.5 shadow-[4px_4px_0_#C1121F] hover:-translate-y-1 hover:shadow-[6px_6px_0_#C1121F] transition-all"
          >
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
            Get Your VYUGAM Pass
          </button>
        </div>

        <p className="font-mono text-xs text-mustard/70 tracking-wider mb-8">
          VYUGAM 2.0 &mdash; Dept. of Information Technology, P.A. College of Engineering and Technology (Autonomous), Pollachi, Coimbatore &ndash; 642002 &copy; 2026
        </p>

        {/* Built By */}
        <div className="mt-10 pt-8 border-t border-marigold/20">
          <div className="built-by-glow inline-flex items-center gap-2 mb-6">
            <Code className="w-4 h-4 text-marigold" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mustard/60">
              Built with
            </span>
            <span className="text-crimson text-sm animate-heartbeat">&#9829;</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mustard/60">
              by
            </span>
            <Code className="w-4 h-4 text-marigold" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <span className="font-heading font-extrabold text-base sm:text-lg text-cream/90 tracking-wide hover:text-marigold transition-colors duration-300 cursor-default">
              Mr. S.P. Darshhan
            </span>

            <span className="w-1.5 h-1.5 rounded-full bg-marigold/50 hidden sm:block" />

            <span className="font-heading font-extrabold text-lg sm:text-xl text-marigold tracking-wide built-by-pulse cursor-default">
              Mr. H. Abhilash
            </span>

            <span className="w-1.5 h-1.5 rounded-full bg-marigold/50 hidden sm:block" />

            <span className="font-heading font-extrabold text-base sm:text-lg text-cream/90 tracking-wide hover:text-marigold transition-colors duration-300 cursor-default">
              Mr. R. Ashok
            </span>
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-mustard/40 mt-5">
            Dept. of Information Technology &mdash; PACET
          </p>
        </div>
      </div>
    </footer>
  );
};
