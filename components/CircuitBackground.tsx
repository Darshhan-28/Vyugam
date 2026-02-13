'use client'

export default function CircuitBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden">
      <svg
        className="w-full h-full opacity-20"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1200 800"
      >
        {/* Horizontal lines */}
        <line x1="0" y1="100" x2="1200" y2="100" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="0" y1="200" x2="1200" y2="200" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="0" y1="300" x2="1200" y2="300" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="0" y1="400" x2="1200" y2="400" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="0" y1="500" x2="1200" y2="500" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="0" y1="600" x2="1200" y2="600" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="0" y1="700" x2="1200" y2="700" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />

        {/* Vertical lines */}
        <line x1="100" y1="0" x2="100" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="200" y1="0" x2="200" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="300" y1="0" x2="300" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="400" y1="0" x2="400" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="600" y1="0" x2="600" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="700" y1="0" x2="700" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="800" y1="0" x2="800" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="900" y1="0" x2="900" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="1000" y1="0" x2="1000" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />
        <line x1="1100" y1="0" x2="1100" y2="800" stroke="rgb(0, 150, 255)" strokeWidth="0.5" />

        {/* Diagonal circuit paths */}
        <polyline
          points="150,150 250,150 250,250 350,250 350,350 450,350"
          stroke="rgb(138, 43, 226)"
          strokeWidth="0.7"
          fill="none"
        />
        <polyline
          points="750,100 850,100 850,200 950,200 950,300"
          stroke="rgb(0, 200, 255)"
          strokeWidth="0.7"
          fill="none"
        />
        <polyline
          points="300,600 400,600 400,500 500,500 500,400"
          stroke="rgb(138, 43, 226)"
          strokeWidth="0.7"
          fill="none"
        />

        {/* Circuit nodes (small circles) */}
        <circle cx="150" cy="150" r="3" fill="rgb(0, 150, 255)" opacity="0.8" />
        <circle cx="250" cy="150" r="3" fill="rgb(0, 150, 255)" opacity="0.8" />
        <circle cx="250" cy="250" r="3" fill="rgb(0, 150, 255)" opacity="0.8" />
        <circle cx="350" cy="250" r="3" fill="rgb(0, 150, 255)" opacity="0.8" />
        <circle cx="350" cy="350" r="3" fill="rgb(0, 150, 255)" opacity="0.8" />
        <circle cx="450" cy="350" r="3" fill="rgb(0, 150, 255)" opacity="0.8" />
        <circle cx="750" cy="100" r="3" fill="rgb(0, 200, 255)" opacity="0.8" />
        <circle cx="850" cy="100" r="3" fill="rgb(0, 200, 255)" opacity="0.8" />
        <circle cx="850" cy="200" r="3" fill="rgb(0, 200, 255)" opacity="0.8" />
        <circle cx="950" cy="200" r="3" fill="rgb(0, 200, 255)" opacity="0.8" />
        <circle cx="300" cy="600" r="3" fill="rgb(138, 43, 226)" opacity="0.8" />
        <circle cx="400" cy="600" r="3" fill="rgb(138, 43, 226)" opacity="0.8" />
        <circle cx="400" cy="500" r="3" fill="rgb(138, 43, 226)" opacity="0.8" />
        <circle cx="500" cy="500" r="3" fill="rgb(138, 43, 226)" opacity="0.8" />
      </svg>
    </div>
  )
}
