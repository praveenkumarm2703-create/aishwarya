import { motion } from 'framer-motion';

/**
 * A cute cartoon heart character drawn in SVG.
 * mood: "happy" | "love" | "shock" | "smug" | "detective" | "sleepy"
 */
export default function Mascot({ mood = 'happy', size = 120, className = '' }) {
  return (
    <motion.div
      className={`mascot ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 200 200" width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id="mascotBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffa3b5" />
            <stop offset=".55" stopColor="#ff5e9c" />
            <stop offset="1" stopColor="#e0408a" />
          </linearGradient>
          <radialGradient id="mascotShine" cx=".3" cy=".25" r=".5">
            <stop offset="0" stopColor="#fff" stopOpacity=".75" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="100" cy="188" rx="48" ry="7" fill="#b03a75" opacity=".15" />

        {/* little arms */}
        <path d="M30 108 q-18 6 -14 24" stroke="#e0408a" strokeWidth="9" strokeLinecap="round" fill="none" />
        {mood === 'detective' ? null : (
          <path d="M170 108 q18 6 14 24" stroke="#e0408a" strokeWidth="9" strokeLinecap="round" fill="none" />
        )}

        {/* body */}
        <path
          fill="url(#mascotBody)"
          d="M100 178S20 128 20 72c0-26 20-46 45-46 16 0 28 8 35 20 7-12 19-20 35-20 25 0 45 20 45 46 0 56-80 106-80 106z"
        />
        <path
          fill="url(#mascotShine)"
          d="M100 178S20 128 20 72c0-26 20-46 45-46 16 0 28 8 35 20 7-12 19-20 35-20 25 0 45 20 45 46 0 56-80 106-80 106z"
        />

        {/* cheeks */}
        <ellipse cx="62" cy="108" rx="13" ry="8" fill="#ff2d6f" opacity=".35" />
        <ellipse cx="138" cy="108" rx="13" ry="8" fill="#ff2d6f" opacity=".35" />

        <Face mood={mood} />

        {mood === 'detective' && (
          <g>
            {/* hat */}
            <path d="M52 44 q48 -40 96 0 z" fill="#8a5a3c" />
            <rect x="40" y="40" width="120" height="10" rx="5" fill="#6b4329" />
            <path d="M88 26 q12 -6 24 0" stroke="#c49a6c" strokeWidth="4" fill="none" />
            {/* magnifier */}
            <path d="M170 108 q16 4 16 18" stroke="#e0408a" strokeWidth="9" strokeLinecap="round" fill="none" />
            <line x1="178" y1="136" x2="192" y2="156" stroke="#6b4329" strokeWidth="7" strokeLinecap="round" />
            <circle cx="170" cy="124" r="16" fill="#e8f6ff" fillOpacity=".7" stroke="#6b4329" strokeWidth="5" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}

function Face({ mood }) {
  const ink = '#4a1d3f';
  switch (mood) {
    case 'love':
      return (
        <g>
          <path fill="#ff1f5a" d="M70 88s-12-7-12-15c0-4 3-7 6-7 3 0 5 2 6 4 1-2 3-4 6-4 3 0 6 3 6 7 0 8-12 15-12 15z" />
          <path fill="#ff1f5a" d="M130 88s-12-7-12-15c0-4 3-7 6-7 3 0 5 2 6 4 1-2 3-4 6-4 3 0 6 3 6 7 0 8-12 15-12 15z" />
          <path d="M84 104 q16 18 32 0" stroke={ink} strokeWidth="5" strokeLinecap="round" fill="#7a1f4a" />
        </g>
      );
    case 'shock':
      return (
        <g>
          <circle cx="72" cy="80" r="11" fill={ink} />
          <circle cx="128" cy="80" r="11" fill={ink} />
          <circle cx="76" cy="76" r="4" fill="#fff" />
          <circle cx="132" cy="76" r="4" fill="#fff" />
          <ellipse cx="100" cy="112" rx="9" ry="11" fill="#7a1f4a" />
          <path d="M150 50 l6 -12 M160 58 l12 -6" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'smug':
      return (
        <g>
          <path d="M60 82 q12 -8 24 0" stroke={ink} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M116 82 q12 -8 24 0" stroke={ink} strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M60 76 l24 -2" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity=".5" />
          <path d="M88 108 q18 10 28 -6" stroke={ink} strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      );
    default:
      return (
        <g>
          <ellipse cx="72" cy="82" rx="8" ry="10" fill={ink} />
          <ellipse cx="128" cy="82" rx="8" ry="10" fill={ink} />
          <circle cx="75" cy="78" r="3" fill="#fff" />
          <circle cx="131" cy="78" r="3" fill="#fff" />
          <path d="M86 104 q14 14 28 0" stroke={ink} strokeWidth="5" strokeLinecap="round" fill="none" />
        </g>
      );
  }
}
