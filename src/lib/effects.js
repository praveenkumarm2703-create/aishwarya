import confetti from 'canvas-confetti';

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function vibrate(pattern = 15) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported (iOS) */
  }
}

let heartShape;
function getHeart() {
  if (!heartShape && confetti.shapeFromPath) {
    heartShape = confetti.shapeFromPath({
      path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
    });
  }
  return heartShape;
}

const PALETTE = ['#ff5e9c', '#ff9a8b', '#ffd1dc', '#c084fc', '#ffffff', '#ff3d6e', '#ffc8a2'];

/** Small burst of hearts from a point (x, y in 0..1). */
export function heartBurst(x = 0.5, y = 0.5, count = 26) {
  if (reduceMotion()) return;
  const heart = getHeart();
  confetti({
    particleCount: count,
    spread: 75,
    startVelocity: 32,
    origin: { x, y },
    colors: ['#ff5e9c', '#ff3d6e', '#ff9ac1', '#c084fc'],
    shapes: heart ? [heart] : ['circle'],
    scalar: 1.4,
    ticks: 140,
    zIndex: 60,
    disableForReducedMotion: true,
  });
}

/** Big celebration: confetti cannons from both sides. */
export function celebrate() {
  if (reduceMotion()) return;
  const heart = getHeart();
  const end = Date.now() + 1600;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: PALETTE, zIndex: 60 });
    confetti({ particleCount: 5, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: PALETTE, zIndex: 60 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({
    particleCount: 60,
    spread: 120,
    startVelocity: 40,
    origin: { x: 0.5, y: 0.45 },
    colors: PALETTE,
    shapes: heart ? [heart, 'circle'] : ['circle'],
    scalar: 1.2,
    zIndex: 60,
  });
}

/** Elementwise origin helper for bursts from a clicked element. */
export function originOf(el) {
  if (!el) return { x: 0.5, y: 0.5 };
  const r = el.getBoundingClientRect();
  return { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight };
}
