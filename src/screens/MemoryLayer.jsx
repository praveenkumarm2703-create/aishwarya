import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote, RotateCcw } from 'lucide-react';
import LayerHeader from '../components/LayerHeader.jsx';
import GlowButton from '../components/GlowButton.jsx';
import Mascot from '../components/Mascot.jsx';
import { fill } from '../config.js';
import { heartBurst, vibrate } from '../lib/effects.js';

const TINTS = ['tint-rose', 'tint-peach', 'tint-lavender', 'tint-berry'];
const EMOJI = ['🌸', '📱', '☕', '✨'];

export default function MemoryLayer({ number, data, onComplete }) {
  const quotes = data.quotes;
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const finished = idx >= quotes.length;

  const advance = (d = 1) => {
    vibrate(12);
    setDir(d);
    setIdx((n) => n + 1);
    if (idx + 1 === quotes.length) setTimeout(() => heartBurst(0.5, 0.5, 36), 250);
  };

  return (
    <div className="screen">
      <LayerHeader number={number} label={data.label} title={data.title} subtitle={data.subtitle} />

      <div className="memory">
        <div className="memory__stack">
          {/* decorative cards peeking behind the current one */}
          {!finished &&
            quotes.slice(idx + 1, idx + 3).map((_, i) => (
              <div
                key={`peek-${idx + 1 + i}`}
                className={`memory__peek card ${TINTS[(idx + 1 + i) % TINTS.length]}`}
                style={{ transform: `translateY(${(i + 1) * 12}px) scale(${1 - (i + 1) * 0.05}) rotate(${i % 2 ? 3 : -3}deg)` }}
              />
            ))}

          <AnimatePresence mode="popLayout" custom={dir}>
            {!finished ? (
              <motion.button
                type="button"
                key={idx}
                custom={dir}
                className={`memory__card card ${TINTS[idx % TINTS.length]}`}
                initial={{ opacity: 0, scale: 0.8, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                exit={(d) => ({ opacity: 0, x: d * 320, rotate: d * 18, transition: { duration: 0.45 } })}
                transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(_, info) => {
                  if (Math.abs(info.offset.x) > 80) advance(info.offset.x > 0 ? 1 : -1);
                }}
                onTap={() => advance(1)}
                aria-label={`Memory ${idx + 1} of ${quotes.length}. Tap for the next one.`}
              >
                <span className="memory__emoji">{EMOJI[idx % EMOJI.length]}</span>
                <Quote className="memory__quote-icon" size={30} />
                <motion.p
                  className="memory__text"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.6 }}
                >
                  {fill(quotes[idx])}
                </motion.p>
                <span className="memory__count">
                  {idx + 1} / {quotes.length} · tap or swipe
                </span>
              </motion.button>
            ) : (
              <motion.div
                key="done"
                className="memory__card memory__card--done card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 15 }}
              >
                <Mascot mood="love" size={100} />
                <p className="memory__text">Every single one of these is true. Every single day. 💗</p>
                <button type="button" className="link-btn" onClick={() => setIdx(0)}>
                  <RotateCcw size={14} /> Read them again
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="memory__dots" aria-hidden="true">
          {quotes.map((_, i) => (
            <span key={i} className={i < idx ? 'on' : i === idx ? 'now' : ''} />
          ))}
        </div>

        <AnimatePresence>
          {finished && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <GlowButton onClick={onComplete} className="btn--pulse">
                {data.unlockButton}
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
