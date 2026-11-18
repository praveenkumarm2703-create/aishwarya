import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import LayerHeader from '../components/LayerHeader.jsx';
import GlowButton from '../components/GlowButton.jsx';
import { fill } from '../config.js';
import { celebrate, heartBurst, vibrate } from '../lib/effects.js';

const HEART = 'M16 29S0 19.5 0 9.2C0 3.9 4 0 8.9 0 12 0 14.6 1.6 16 4c1.4-2.4 4-4 7.1-4C28 0 32 3.9 32 9.2 32 19.5 16 29 16 29z';

export default function HeartLayer({ number, data, onComplete }) {
  const quotes = data.quotes;
  const [taps, setTaps] = useState(0); // number of quotes revealed
  const [phase, setPhase] = useState('tapping'); // tapping | countdown | ready
  const [count, setCount] = useState(5);
  const [ripples, setRipples] = useState([]);
  const beat = useAnimationControls();

  const allShown = taps >= quotes.length;
  const level = Math.min(taps / quotes.length, 1);

  // idle heartbeat
  useEffect(() => {
    if (phase !== 'tapping') return;
    const id = setInterval(() => {
      beat.start({ scale: [1, 1.08, 1, 1.05, 1], transition: { duration: 0.9 } });
    }, 1600);
    return () => clearInterval(id);
  }, [phase, beat]);

  // countdown 5 → 1
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (count === 0) {
      setPhase('ready');
      celebrate();
      vibrate([60, 80, 60, 80, 120]);
      return;
    }
    vibrate(30);
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count]);

  const tapHeart = () => {
    if (phase !== 'tapping') return;
    beat.start({ scale: [1, 1.28, 0.92, 1.12, 1], transition: { duration: 0.6 } });
    vibrate([20, 50, 20]);
    const id = Date.now();
    setRipples((r) => [...r.slice(-3), id]);
    setTimeout(() => setRipples((r) => r.filter((x) => x !== id)), 1100);
    heartBurst(0.5, 0.42, 14);
    if (allShown) {
      setPhase('countdown');
      setCount(5);
    } else {
      setTaps((n) => n + 1);
    }
  };

  const hint =
    taps === 0 ? 'Tap the heart 💓' : allShown ? 'Tap once more to connect our hearts 💞' : 'Keep tapping…';

  return (
    <div className="screen">
      <LayerHeader number={number} label={data.label} title={data.title} subtitle={data.subtitle} />

      <div className="heart-stage">
        <AnimatePresence mode="wait">
          {phase === 'tapping' && (
            <motion.div key="tap" className="heart-stage__inner" exit={{ opacity: 0, scale: 0.6 }}>
              <div className="big-heart-wrap">
                {ripples.map((id) => (
                  <span key={id} className="ripple" />
                ))}
                <motion.button
                  type="button"
                  className="big-heart"
                  animate={beat}
                  onClick={tapHeart}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Tap the heart"
                >
                  <svg viewBox="-2 -2 36 33" width="100%" height="100%" aria-hidden="true">
                    <defs>
                      <linearGradient id="bigHeartFill" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#ff9ab8" />
                        <stop offset=".5" stopColor="#ff3d7f" />
                        <stop offset="1" stopColor="#a63dff" />
                      </linearGradient>
                      <clipPath id="bigHeartClip">
                        <path d={HEART} />
                      </clipPath>
                    </defs>
                    <path d={HEART} fill="rgba(255,255,255,.55)" stroke="#ff5e9c" strokeWidth="1.2" />
                    <g clipPath="url(#bigHeartClip)">
                      <motion.rect
                        x="0"
                        width="32"
                        height="29"
                        fill="url(#bigHeartFill)"
                        initial={false}
                        animate={{ y: 29 - 29 * (0.18 + level * 0.82) }}
                        transition={{ type: 'spring', stiffness: 60, damping: 14 }}
                      />
                    </g>
                    <ellipse cx="8.5" cy="7.5" rx="3.2" ry="1.8" fill="#fff" opacity=".6" transform="rotate(-35 8.5 7.5)" />
                  </svg>
                  <span className="big-heart__pct">{Math.round(level * 100)}%</span>
                </motion.button>
              </div>
              <p className="hint">{hint}</p>

              <div className="heart-quote" aria-live="polite">
                <AnimatePresence mode="wait">
                  {taps > 0 && (
                    <motion.p
                      key={taps}
                      className="heart-quote__text"
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
                      transition={{ duration: 0.55 }}
                    >
                      “{fill(quotes[taps - 1])}”
                    </motion.p>
                  )}
                </AnimatePresence>
                <div className="heart-quote__dots">
                  {quotes.map((_, i) => (
                    <span key={i} className={i < taps ? 'on' : ''} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'countdown' && (
            <motion.div key="count" className="heart-stage__inner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="hint">{fill(data.countdownIntro)}</p>
              <div className="countdown">
                <svg className="countdown__ring" viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="54" />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="54"
                    className="countdown__progress"
                    initial={{ pathLength: 1 }}
                    animate={{ pathLength: 0 }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                </svg>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={count}
                    className="countdown__num"
                    initial={{ scale: 2.4, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ scale: 0.3, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  >
                    {Math.max(count, 1)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {phase === 'ready' && (
            <motion.div
              key="ready"
              className="heart-stage__inner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p
                className="whisper"
                initial={{ opacity: 0, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, letterSpacing: '0.01em' }}
                transition={{ duration: 1.6 }}
              >
                {fill(data.afterCountdown)}
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
                <GlowButton onClick={onComplete} className="btn--pulse btn--xl">
                  {data.button}
                </GlowButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
