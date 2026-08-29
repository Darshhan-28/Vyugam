import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const Team: React.FC = () => {
  const members = [
    { name: 'Mr. H. Abhilash', role: 'Secretary', phone: '7558108034', image: '/images/abhilash.jpeg' },
    { name: 'Ms. C. Arundhathi', role: 'Joint Secretary', phone: '8667718766', image: '/images/arundhathi.jpeg' },
    { name: 'Ms. M. Rubeswari', role: 'Additional Secretary', phone: '8144055431', image: '/images/rubeswari.jpeg' },
    { name: 'Mr. H. Vishnuprasad', role: 'Treasurer', phone: '9360438970', image: '/images/vishnuprasad.jpeg' },
  ];

  return (
    <section id="members" className="py-24 px-4 bg-members border-t-4 border-marigold border-b-4 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <span className="font-heading font-extrabold text-sm uppercase tracking-widest bg-marigold text-obsidian px-5 py-2 clip-polygon shadow-[4px_4px_0_#7A0606] inline-block mb-4">
          The Team Behind It
        </span>

        <h2 className="font-display text-4xl sm:text-5xl text-smoke uppercase tracking-tight mb-4">
          IT Association Office-Bearers
        </h2>

        <p className="font-body text-base text-cream/90 max-w-xl mx-auto mb-14">
          The students steering VYUGAM 2.0 from paperwork to closing blast.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m, idx) => (
            <div
              key={idx}
              className="bg-obsidian border-2 border-carbon-2 p-6 shadow-[6px_6px_0_#7A0606] hover:-translate-y-1 hover:border-marigold hover:shadow-[8px_8px_0_#7A0606] transition-all flex flex-col items-center text-center"
            >
              {/* Member Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-oxblood to-marigold p-1 mb-4 shadow-lg overflow-hidden">
                {m.image ? (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-carbon flex items-center justify-center font-display text-2xl text-marigold">
                    {m.name.split(' ').pop()?.[0] || 'M'}
                  </div>
                )}
              </div>

              <span className="font-heading font-extrabold text-xs uppercase tracking-widest bg-marigold text-obsidian px-3 py-1 mb-3 clip-polygon">
                {m.role}
              </span>

              <h3 className="font-heading font-extrabold text-lg text-smoke uppercase mb-3">
                {m.name}
              </h3>

              <div className="flex gap-2 w-full mt-auto">
                <a
                  href={`tel:${m.phone}`}
                  className="flex-1 font-mono text-xs text-marigold border border-marigold/40 py-2 hover:bg-marigold hover:text-obsidian transition-colors flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <a
                  href={`https://wa.me/91${m.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 font-mono text-xs text-emerald-400 border border-emerald-500/40 py-2 hover:bg-emerald-500 hover:text-obsidian transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
