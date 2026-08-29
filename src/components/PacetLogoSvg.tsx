import React from 'react';

export const PacetLogoSvg: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => {
  return (
    <svg viewBox="0 0 300 300" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pacetSphereGrad" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="65%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#075985" />
        </radialGradient>
        <radialGradient id="goldGearGrad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#FDB515" />
          <stop offset="100%" stopColor="#CA8A04" />
        </radialGradient>
        <path id="collegeArcPath" d="M 40,150 a 110,110 0 1,1 220,0 a 110,110 0 1,1 -220,0" />
      </defs>

      {/* Outer Gear Wheel */}
      <g fill="url(#goldGearGrad)" stroke="#050505" strokeWidth="2.5">
        <circle cx="150" cy="150" r="140" />
        {/* Gear Teeth */}
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(0 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(18 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(36 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(54 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(72 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(90 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(108 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(126 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(144 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(162 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(180 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(198 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(216 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(234 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(252 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(270 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(288 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(306 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(324 150 150)" />
        <rect x="142" y="2" width="16" height="18" rx="2" transform="rotate(342 150 150)" />

        <circle cx="150" cy="150" r="126" fill="#FEF08A" stroke="#050505" strokeWidth="3" />
        <circle cx="150" cy="150" r="96" fill="#FFFFFF" stroke="#050505" strokeWidth="3.5" />
      </g>

      {/* Circular Text */}
      <text fontFamily="'Barlow Condensed', sans-serif" fontSize="15" fontWeight="900" fill="#050505" letterSpacing="1.5">
        <textPath href="#collegeArcPath" startOffset="50%" textAnchor="middle">
          P.A. COLLEGE OF ENGINEERING AND TECHNOLOGY
        </textPath>
      </text>

      {/* Central Blue Sphere */}
      <circle cx="150" cy="150" r="68" fill="url(#pacetSphereGrad)" stroke="#050505" strokeWidth="3" />

      {/* Laptop */}
      <g transform="translate(118, 108) scale(1.35)" fill="#FFFFFF" stroke="#050505" strokeWidth="1.5">
        <rect x="6" y="4" width="32" height="20" rx="2" fill="#F8FAFC" />
        <rect x="9" y="7" width="26" height="14" fill="#38BDF8" />
        <path d="M 2 24 L 42 24 L 38 28 L 6 28 Z" fill="#94A3B8" />
      </g>

      {/* Transmission Tower */}
      <g transform="translate(100, 144)" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
        <line x1="16" y1="38" x2="24" y2="8" />
        <line x1="32" y1="38" x2="24" y2="8" />
        <line x1="18" y1="30" x2="30" y2="30" />
        <line x1="20" y1="22" x2="28" y2="22" />
        <circle cx="24" cy="8" r="3" fill="#DC2626" stroke="none" />
      </g>

      {/* Satellite Dish */}
      <g transform="translate(164, 144)" stroke="#050505" strokeWidth="2" fill="none">
        <path d="M 6 10 A 16 16 0 0 1 26 28" fill="#E2E8F0" strokeWidth="2.5" />
        <line x1="16" y1="20" x2="28" y2="10" strokeWidth="2.5" />
        <line x1="22" y1="28" x2="28" y2="38" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Bottom Ribbon */}
      <g transform="translate(0, 222)">
        <path d="M 20 18 L 66 18 L 76 38 L 66 58 L 20 58 L 34 38 Z" fill="#FDB515" stroke="#050505" strokeWidth="3" />
        <path d="M 280 18 L 234 18 L 224 38 L 234 58 L 280 58 L 266 38 Z" fill="#FDB515" stroke="#050505" strokeWidth="3" />
        <rect x="58" y="22" width="184" height="36" fill="#FEF08A" stroke="#050505" strokeWidth="3" rx="2" />
        <path d="M 58 46 L 68 58 L 58 58 Z" fill="#B45309" stroke="#050505" strokeWidth="1.5" />
        <path d="M 242 46 L 232 58 L 242 58 Z" fill="#B45309" stroke="#050505" strokeWidth="1.5" />
        <text x="92" y="46" fontFamily="'Barlow Condensed', sans-serif" fontSize="13" fontWeight="900" fill="#050505" letterSpacing="1">LEARN</text>
        <text x="150" y="46" fontFamily="'Barlow Condensed', sans-serif" fontSize="13" fontWeight="900" fill="#050505" letterSpacing="1" textAnchor="middle">WORK</text>
        <text x="210" y="46" fontFamily="'Barlow Condensed', sans-serif" fontSize="13" fontWeight="900" fill="#050505" letterSpacing="1" textAnchor="end">SUCCEED</text>
      </g>
    </svg>
  );
};
