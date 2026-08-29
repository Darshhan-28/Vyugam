import React from 'react';
import { Trophy, Award, Utensils, Zap } from 'lucide-react';

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
      desc: 'Official Certificate of Merit for winners and Certificate of Participation for all delegates.',
    },
    {
      icon: <Utensils className="w-10 h-10 text-marigold" />,
      title: 'Food & Drinks',
      desc: 'Delicious complimentary lunch and high-energy refreshment sessions provided to all delegates.',
    },
    {
      icon: <Zap className="w-10 h-10 text-marigold" />,
      title: 'Zero Entry Fee',
      desc: '100% Free Registration for all college students across all tracks and events.',
    },
  ];

  return (
    <section id="prizes" className="py-24 px-4 bg-prizes border-t-4 border-marigold border-b-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
          Rewards &amp; Glory
        </span>

        <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-4">
          What You Win &amp; What You Get
        </h2>

        <p className="font-body text-base text-cream/90 max-w-xl mx-auto mb-14">
          More than just trophies — walk away with recognition, networking, and awesome perks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {prizes.map((p, idx) => (
            <div
              key={idx}
              className="bg-carbon border-2 border-carbon-2 p-8 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1.5 hover:border-marigold hover:shadow-[8px_8px_0_#C1121F] transition-all flex flex-col items-center text-center group"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {p.icon}
              </div>
              <h3 className="font-heading font-extrabold text-xl text-marigold uppercase tracking-wider mb-2">
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
