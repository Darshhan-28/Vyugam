import React, { useState } from 'react';
import { EVENT_TRACKS, EventTrack } from '../data/events';
import { Code, HelpCircle, Layout, FileText, Image as ImageIcon, Users, ArrowRight, Sparkles } from 'lucide-react';

interface EventsProps {
  onSelectEvent: (eventTrack: EventTrack) => void;
}

export const Events: React.FC<EventsProps> = ({ onSelectEvent }) => {
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
          Challenge Arenas
        </span>

        <h2 className="font-display text-4xl sm:text-6xl text-smoke uppercase tracking-tight mb-4">
          Five Tracks. Pick Your Fight.
        </h2>

        {/* Announcement Banner */}
        <div className="inline-flex items-center justify-center gap-2 font-mono text-[11px] sm:text-sm font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/40 px-4 sm:px-6 py-2 sm:py-2.5 rounded mb-8 sm:mb-10 animate-spark max-w-full text-center flex-wrap">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Registrations for Vyugam 2.0 are Open! Deadline: 17 Sept 2026. Select an event below to register</span>
        </div>

        {/* Event Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-2">
          {['all', 'coding', 'quiz', 'design', 'paper', 'poster'].map((cat) => (
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredEvents.map((track) => (
            <div
              key={track.id}
              className="relative bg-obsidian border-3 border-carbon-2 p-7 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1.5 hover:border-marigold hover:shadow-[10px_10px_0_#7A0606] transition-all flex flex-col justify-between group"
            >
              {/* Ribbon */}
              <span className="absolute top-0 right-4 bg-marigold text-obsidian font-heading font-extrabold text-xs uppercase tracking-widest px-3 py-1 clip-ribbon">
                {track.ribbon}
              </span>

              <div>
                <div className="mb-5 group-hover:drop-shadow-[0_0_10px_rgba(253,181,21,0.6)] transition-all">
                  {getIcon(track.iconName)}
                </div>

                <h3 className="font-heading font-extrabold text-2xl text-smoke uppercase tracking-wider mb-2">
                  {track.title}
                </h3>

                <p className="font-body text-sm text-cream/90 leading-relaxed mb-4 min-h-[50px]">
                  {track.description}
                </p>

                <div className="font-mono text-xs font-bold text-marigold bg-marigold/10 border border-marigold/30 px-3 py-1.5 rounded inline-flex items-center gap-1.5 mb-6">
                  <Users className="w-3.5 h-3.5" />
                  Team Size: {track.teamSizeLabel}
                </div>
              </div>

              <div>
                <button
                  onClick={() => onSelectEvent(track)}
                  className="w-full font-heading font-extrabold text-sm uppercase tracking-wider text-obsidian bg-marigold border-2 border-obsidian py-3 px-4 shadow-[4px_4px_0_#C1121F] hover:bg-cream hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#C1121F] active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  Register for Event
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="font-mono text-[11px] uppercase tracking-widest text-mustard mt-3">
                  // {track.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
