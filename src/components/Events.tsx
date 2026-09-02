import React, { useState } from 'react';
import { EVENT_TRACKS } from '../data/events';
import { Code, HelpCircle, Layout, FileText, Image as ImageIcon, Users, Sparkles } from 'lucide-react';

export const Events: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code className="w-8 h-8 text-marigold" />;
      case 'HelpCircle': return <HelpCircle className="w-8 h-8 text-marigold" />;
      case 'Layout': return <Layout className="w-8 h-8 text-marigold" />;
      case 'FileText': return <FileText className="w-8 h-8 text-marigold" />;
      case 'Image': return <ImageIcon className="w-8 h-8 text-marigold" />;
      default: return <Sparkles className="w-8 h-8 text-marigold" />;
    }
  };

  const filteredEvents = filter === 'all'
    ? EVENT_TRACKS
    : EVENT_TRACKS.filter(e => e.ribbon.toLowerCase() === filter.toLowerCase());

  return (
    <section id="arenas" className="py-24 px-4 bg-arenas border-t-4 border-marigold border-b-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
          The Five Arenas
        </span>

        <h2 className="font-display text-4xl sm:text-6xl text-smoke uppercase tracking-tight mb-3">
          Five Ways To Compete.
        </h2>
        <p className="font-heading font-bold text-lg sm:text-2xl text-marigold uppercase tracking-wide mb-6">
          One Pass To Enter The Experience.
        </p>

        {/* Announcement Banner */}
        <div className="inline-flex items-center justify-center gap-2 font-mono text-[11px] sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 px-4 sm:px-6 py-2 sm:py-2.5 rounded mb-8 sm:mb-10 animate-spark max-w-full text-center flex-wrap">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>VYUGAM Pass registrations are Open! Deadline: 17 Sept 2026. Get your pass and enter the experience.</span>
        </div>

        {/* Event Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
          {['all', 'code', 'quiz', 'design', 'paper', 'poster'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-heading font-bold text-xs sm:text-sm uppercase tracking-wider px-3.5 sm:px-5 py-2 border-2 transition-all ${
                filter === cat
                  ? 'bg-marigold text-obsidian border-obsidian shadow-[3px_3px_0_#C1121F]'
                  : 'bg-obsidian text-cream border-carbon-2 hover:border-marigold'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid — display only, no register buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredEvents.map((track) => (
            <div
              key={track.id}
              className="relative bg-obsidian border-3 border-carbon-2 p-7 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1.5 hover:border-marigold hover:shadow-[10px_10px_0_#7A0606] transition-all flex flex-col group"
            >
              {/* Ribbon */}
              <span className="absolute top-0 right-4 bg-marigold text-obsidian font-heading font-extrabold text-xs uppercase tracking-widest px-3 py-1 clip-ribbon">
                {track.ribbon}
              </span>

              <div className="mb-5 group-hover:drop-shadow-[0_0_10px_rgba(253,181,21,0.6)] transition-all">
                {getIcon(track.iconName)}
              </div>

              <h3 className="font-heading font-extrabold text-2xl text-smoke uppercase tracking-wider mb-1">
                {track.title}
              </h3>

              <p className="font-mono text-[10px] uppercase tracking-widest text-ember font-bold mb-3">
                {track.category}
              </p>

              <p className="font-body text-sm text-cream/90 leading-relaxed mb-5 flex-1">
                {track.description}
              </p>

              <div className="font-mono text-xs font-bold text-marigold bg-marigold/10 border border-marigold/30 px-3 py-1.5 rounded inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Team Size: {track.teamSizeLabel}
              </div>

              <div className="font-mono text-[11px] uppercase tracking-widest text-mustard/50 mt-4">
                // {track.category}
              </div>
            </div>
          ))}
        </div>

        {/* Footer disclaimer */}
        <p className="font-mono text-xs sm:text-sm text-cream/50 max-w-2xl mx-auto mt-12 leading-relaxed border-t border-marigold/20 pt-8">
          Your VYUGAM Pass gives you access to the symposium. Event participation is subject to individual event rules, team requirements, and available slots.
        </p>
      </div>
    </section>
  );
};
