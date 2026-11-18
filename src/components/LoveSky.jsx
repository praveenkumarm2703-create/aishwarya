import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * Full-screen canvas for the finale: hundreds of floating hearts,
 * twinkling glowing particles and (optionally) fireworks.
 * Sprites are pre-rendered once so it stays smooth on phones.
 */
const COLORS = ['#ff5e9c', '#ff8fc0', '#ff3d6e', '#f0abfc', '#c084fc', '#ffd1e3'];

function heartSprite(color, size) {
  const c = document.createElement('canvas');
  const pad = size * 0.6;
  c.width = c.height = size + pad * 2;
  const g = c.getContext('2d');
  g.shadowColor = color;
  g.shadowBlur = pad * 0.8;
  g.fillStyle = color;
  g.translate(pad, pad);
  const s = size / 32;
  g.scale(s, s);
  g.fill(new Path2D('M16 29S0 19.5 0 9.2C0 3.9 4 0 8.9 0 12 0 14.6 1.6 16 4c1.4-2.4 4-4 7.1-4C28 0 32 3.9 32 9.2 32 19.5 16 29 16 29z'));
  return c;
}

function glowSprite(color, r = 16) {
  const c = document.createElement('canvas');
  c.width = c.height = r * 2;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.25, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, r * 2, r * 2);
  return c;
}

export default function LoveSky({ fireworks = false, density = 1 }) {
  const ref = useRef(null);
  const fwRef = useRef(fireworks);
  fwRef.current = fireworks;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let fwTimer = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const hearts = COLORS.map((c) => heartSprite(c, 32));
    const glows = COLORS.map((c) => glowSprite(c));

    const mobile = w < 700;
    const HEARTS = Math.round((mobile ? 110 : 200) * density * (reduce ? 0.3 : 1));
    const SPARKS = Math.round((mobile ? 70 : 120) * density * (reduce ? 0.3 : 1));

    const newHeart = (initial) => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 40,
      size: 8 + Math.random() * Math.random() * 30,
      vy: 18 + Math.random() * 45,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.5 + Math.random() * 1.2,
      alpha: 0.25 + Math.random() * 0.6,
      sprite: Math.floor(Math.random() * hearts.length),
      rot: (Math.random() - 0.5) * 0.6,
    });
    const flock = Array.from({ length: HEARTS }, () => newHeart(true));

    const sparks = Array.from({ length: SPARKS }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 2 + Math.random() * 6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 2,
      vy: -4 - Math.random() * 10,
      sprite: Math.floor(Math.random() * glows.length),
    }));

    const particles = [];
    const rockets = [];

    const launch = () => {
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7),
        y: h + 10,
        vy: -(h * 0.75 + Math.random() * h * 0.35),
        targetY: h * (0.12 + Math.random() * 0.35),
        color: Math.floor(Math.random() * glows.length),
      });
    };

    const explode = (x, y, color) => {
      const n = mobile ? 46 : 70;
      const heartShaped = Math.random() < 0.45;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        let vx;
        let vy;
        if (heartShaped) {
          // parametric heart curve
          const hx = 16 * Math.pow(Math.sin(a), 3);
          const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
          vx = hx * 9;
          vy = hy * 9;
        } else {
          const sp = 90 + Math.random() * 120;
          vx = Math.cos(a) * sp;
          vy = Math.sin(a) * sp;
        }
        particles.push({ x, y, vx, vy, life: 1, decay: 0.45 + Math.random() * 0.35, color: (color + (i % 2)) % glows.length });
      }
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      // twinkling particles
      for (const s of sparks) {
        s.phase += s.speed * dt;
        s.y += s.vy * dt;
        if (s.y < -10) {
          s.y = h + 10;
          s.x = Math.random() * w;
        }
        ctx.globalAlpha = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(s.phase));
        const d = s.r * 2;
        ctx.drawImage(glows[s.sprite], s.x - s.r, s.y - s.r, d, d);
      }

      ctx.globalCompositeOperation = 'source-over';
      // floating hearts
      for (let i = 0; i < flock.length; i++) {
        const p = flock[i];
        p.y -= p.vy * dt;
        p.sway += p.swaySpeed * dt;
        if (p.y < -60) flock[i] = newHeart(false);
        const x = p.x + Math.sin(p.sway) * 18;
        const img = hearts[p.sprite];
        const scale = p.size / 32;
        const dw = img.width * scale;
        ctx.globalAlpha = p.alpha;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rot + Math.sin(p.sway) * 0.15);
        ctx.drawImage(img, -dw / 2, -dw / 2, dw, dw);
        ctx.restore();
      }

      // fireworks
      if (fwRef.current && !reduce) {
        fwTimer -= dt;
        if (fwTimer <= 0) {
          launch();
          fwTimer = 0.6 + Math.random() * 1.1;
        }
      }
      ctx.globalCompositeOperation = 'lighter';
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy * dt;
        r.vy *= 0.985;
        ctx.globalAlpha = 1;
        ctx.drawImage(glows[r.color], r.x - 9, r.y - 9, 18, 18);
        ctx.globalAlpha = 0.4;
        ctx.drawImage(glows[r.color], r.x - 3, r.y + 6, 6, 14);
        if (r.y <= r.targetY || Math.abs(r.vy) < 80) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= 0.975;
        p.vy = p.vy * 0.975 + 60 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= p.decay * dt;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life;
        const d = 18 * p.life + 5;
        ctx.drawImage(glows[p.color], p.x - d / 2, p.y - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [density]);

  // Portal to <body> so `position: fixed` is never trapped by an animated parent.
  return createPortal(<canvas ref={ref} className="love-sky" aria-hidden="true" />, document.body);
}
