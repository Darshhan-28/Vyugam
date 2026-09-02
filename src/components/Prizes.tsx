import React from 'react';
import { Trophy, Award, Utensils, Network, Ticket } from 'lucide-react';

export const Prizes: React.FC = () => {
  const prizes = [
    {
      icon: <Trophy className="w-10 h-10 text-marigold" />,
      title: 'Cash & Trophies',
      desc: 'Exciting cash awards and championship trophies for top performers in each arena.',
    },
    {
      icon: <Award className="w-10 h-10 text-marigold" />,
      title: 'Certificates',
      desc: 'Official Certificate of Merit for winners and Certificate of Participation for all registered delegates.',
    },
    {
      icon: <Utensils className="w-10 h-10 text-marigold" />,
      title: 'Food & Refreshments',
      desc: 'Complimentary food and refreshments for all registered delegates throughout the day.',
    },
    {
      icon: <Network className="w-10 h-10 text-marigold" />,
      title: 'Networking',
      desc: 'Connect with peers, competitors, and professionals from across institutions.',
    },
    {
      icon: <Ticket className="w-10 h-10 text-marigold" />,
      title: 'ONE PASS · ₹200',
      desc: 'The complete VYUGAM symposium experience. Five arenas. One day. One pass.',
    },
  ];

  return (
    <section id="prizes" className="py-24 px-4 bg-prizes border-t-4 border-marigold border-b-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
          What You Take Home
        </span>

        <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-4">
          More Than Just Trophies.
        </h2>

        <p className="font-body text-base text-cream/90 max-w-xl mx-auto mb-14">
          Walk away with recognition, connections, skills, and memories from a full day in the arena.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {prizes.map((p, idx) => (
            <div
              key={idx}
              className={`bg-carbon border-2 p-8 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1.5 hover:shadow-[8px_8px_0_#C1121F] transition-all flex flex-col items-center text-center group ${
                idx === prizes.length - 1
                  ? 'border-marigold sm:col-span-2 xl:col-span-1'
                  : 'border-carbon-2 hover:border-marigold'
              }`}
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className={`font-heading font-extrabold text-lg uppercase tracking-wider mb-2 ${
                idx === prizes.length - 1 ? 'text-marigold' : 'text-marigold'
              }`}>
                {p.title}
              </h3>
              <p className="font-body text-sm text-cream/80 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
