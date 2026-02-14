'use client'

export default function Prizes() {
  const prizes = [
    { place: 'Winner', icon: '🥇', color: 'text-yellow-400' },
    { place: '1st Runner-up', icon: '🥈', color: 'text-gray-300' },
    { place: '2nd Runner-up', icon: '🥉', color: 'text-orange-400' },
  ]

  return (
    <section id="prizes" className="relative py-20 px-4 border-b neon-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-center text-secondary neon-glow-purple mb-4">
          PRIZE POOL
        </h2>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Compete with the best and win attractive rewards for your outstanding performance
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {prizes.map((prize, idx) => (
            <div
              key={idx}
              className="neon-border-purple rounded-lg p-5 md:p-8 text-center space-y-3 md:space-y-4 transition-all duration-300 hover:shadow-[0_0_20px_rgba(138,43,226,0.3)] group"
            >
              <div className="text-6xl md:text-7xl group-hover:scale-110 transition-transform duration-300">
                {prize.icon}
              </div>
              <h3 className="font-heading text-2xl font-bold text-secondary">
                {prize.place}
              </h3>
              <p className="text-lg text-primary neon-glow font-bold">
                Attractive Prizes
              </p>
              <div className="h-0.5 w-12 bg-secondary mx-auto mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
