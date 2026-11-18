import { memo, useMemo } from 'react';

const ITEMS = ['heart', 'heart', 'heart', 'sparkle', 'sparkle', 'flower', 'bubble', 'star'];

function rand(seed) {
  // deterministic pseudo-random so items don't jump on re-render
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function Shape({ type, color }) {
  switch (type) {
    case 'heart':
      return (
        <svg viewBox="0 0 32 29" aria-hidden="true">
          <path fill={color} d="M16 29S0 19.5 0 9.2C0 3.9 4 0 8.9 0 12 0 14.6 1.6 16 4c1.4-2.4 4-4 7.1-4C28 0 32 3.9 32 9.2 32 19.5 16 29 16 29z" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill={color} d="M12 0c.7 6.2 5.8 11.3 12 12-6.2.7-11.3 5.8-12 12-.7-6.2-5.8-11.3-12-12C6.2 11.3 11.3 6.2 12 0z" />
        </svg>
      );
    case 'star':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill={color} d="M12 1l3.2 6.9 7.5.9-5.6 5.1 1.5 7.4L12 17.6 5.4 21.3l1.5-7.4L1.3 8.8l7.5-.9z" />
        </svg>
      );
    case 'flower':
      return (
        <svg viewBox="0 0 40 40" aria-hidden="true">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx="20" cy="10" rx="7" ry="10" fill={color} transform={`rotate(${r} 20 20)`} opacity=".9" />
          ))}
          <circle cx="20" cy="20" r="5.5" fill="#ffe08a" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="10" cy="10" r="9" fill="none" stroke={color} strokeWidth="1.2" opacity=".8" />
          <ellipse cx="7" cy="6.5" rx="2.5" ry="1.5" fill="#fff" opacity=".7" />
        </svg>
      );
  }
}

const LIGHT_COLORS = ['#ff7eb3', '#ff9a8b', '#ffffff', '#c9a7ff', '#ffb3c9', '#ff5e9c', '#ffc6a5'];
const DARK_COLORS = ['#ff5e9c', '#ff8fc0', '#c084fc', '#ffd1e3', '#ff3d6e', '#f0abfc'];

/** Animated gradient + floating hearts, sparkles, flowers and bubbles (pure CSS animation for smoothness). */
function Background({ variant = 'light', count = 22 }) {
  const colors = variant === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const type = ITEMS[Math.floor(rand(i + 1) * ITEMS.length)];
        return {
          id: i,
          type,
          color: colors[Math.floor(rand(i + 7) * colors.length)],
          left: rand(i + 3) * 100,
          size: (type === 'sparkle' ? 10 : 14) + rand(i + 5) * (type === 'flower' ? 26 : 22),
          duration: 12 + rand(i + 11) * 14,
          delay: -rand(i + 13) * 26,
          drift: (rand(i + 17) - 0.5) * 80,
          opacity: 0.35 + rand(i + 19) * 0.5,
        };
      }),
    [count, variant] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div className={`bg bg--${variant}`} aria-hidden="true">
      <div className="bg__gradient" />
      <div className="bg__glow bg__glow--a" />
      <div className="bg__glow bg__glow--b" />
      {items.map((it) => (
        <span
          key={it.id}
          className={`floaty floaty--${it.type}`}
          style={{
            left: `${it.left}%`,
            width: it.size,
            height: it.size,
            opacity: it.opacity,
            animationDuration: `${it.duration}s`,
            animationDelay: `${it.delay}s`,
            '--drift': `${it.drift}px`,
          }}
        >
          <Shape type={it.type} color={it.color} />
        </span>
      ))}
    </div>
  );
}

export default memo(Background);
