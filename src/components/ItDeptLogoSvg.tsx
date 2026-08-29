import React from 'react';

export const ItDeptLogoSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="itTopArc" d="M 45 150 A 105 105 0 0 1 255 150" />
        <path id="itBottomArc" d="M 255 150 A 105 105 0 0 1 45 150" />
        <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>

      {/* White Background Circle for Contrast */}
      <circle cx="150" cy="150" r="142" fill="#FFFFFF" stroke="#2563EB" strokeWidth="4" />

      {/* Top Curved Banner / Arc: Your Vision Our Code */}
      <path d="M 50 150 A 100 100 0 0 1 250 150" fill="none" stroke="#1E40AF" strokeWidth="20" strokeLinecap="round" opacity="0.15" />
      <text font-family="'Barlow Condensed', sans-serif" font-size="16" font-weight="900" fill="#1E40AF" letter-spacing="2">
        <textPath href="#itTopArc" startOffset="50%" textAnchor="middle">
          YOUR VISION OUR CODE
        </textPath>
      </text>

      {/* Bottom Curved Banner / Arc: INFORMATION TECHNOLOGY */}
      <text font-family="'Barlow Condensed', sans-serif" font-size="16" font-weight="900" fill="#1E40AF" letter-spacing="2">
        <textPath href="#itBottomArc" startOffset="50%" textAnchor="middle">
          INFORMATION TECHNOLOGY
        </textPath>
      </text>

      {/* Orbital Rings & Planets */}
      <ellipse cx="150" cy="150" rx="75" ry="40" fill="none" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 4" transform="rotate(-15 150 150)" />
      <ellipse cx="150" cy="150" rx="85" ry="48" fill="none" stroke="#60A5FA" strokeWidth="1.5" transform="rotate(20 150 150)" />

      <circle cx="95" cy="115" r="7" fill="#EC4899" stroke="#050505" strokeWidth="1" />
      <circle cx="215" cy="120" r="6" fill="#3B82F6" stroke="#050505" strokeWidth="1" />
      <circle cx="190" cy="190" r="5" fill="#8B5CF6" stroke="#050505" strokeWidth="1" />

      {/* Cyber Wings (Left Wing) */}
      <g fill="url(#wingGrad)" stroke="#1E3A8A" strokeWidth="2">
        {/* Top Feather */}
        <path d="M 105 130 C 70 100 35 75 20 65 C 40 90 70 120 100 138 Z" />
        {/* Middle Feather */}
        <path d="M 110 145 C 75 125 45 110 30 100 C 50 120 75 140 105 152 Z" />
        {/* Lower Feather */}
        <path d="M 115 160 C 85 145 60 135 48 130 C 65 145 85 160 110 165 Z" />
      </g>

      {/* Cyber Wings (Right Wing - Mirrored) */}
      <g fill="url(#wingGrad)" stroke="#1E3A8A" strokeWidth="2">
        {/* Top Feather */}
        <path d="M 195 130 C 230 100 265 75 280 65 C 260 90 230 120 200 138 Z" />
        {/* Middle Feather */}
        <path d="M 190 145 C 225 125 255 110 270 100 C 250 120 225 140 195 152 Z" />
        {/* Lower Feather */}
        <path d="M 185 160 C 215 145 240 135 252 130 C 235 145 215 160 190 165 Z" />
      </g>

      {/* Central "I T" Circuit Monogram */}
      <g transform="translate(108, 105)" fill="none" stroke="#1E40AF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
        {/* Letter 'I' Circuit */}
        <path d="M 12 6 L 30 6 M 21 6 L 21 48 M 12 48 L 30 48" />
        <circle cx="21" cy="22" r="3" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
        <circle cx="21" cy="34" r="3" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />

        {/* Letter 'T' Circuit */}
        <path d="M 48 6 L 82 6 M 65 6 L 65 48" />
        <line x1="48" y1="18" x2="65" y2="18" />
        <circle cx="56" cy="18" r="3" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
        <circle cx="65" cy="32" r="3" fill="#60A5FA" stroke="#1E40AF" strokeWidth="2" />
      </g>
    </svg>
  );
};
