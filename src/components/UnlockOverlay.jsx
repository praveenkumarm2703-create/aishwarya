import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, LockOpen } from 'lucide-react';
import { heartBurst, vibrate } from '../lib/effects.js';

/** Glowing heart that "opens" the next layer. Calls onDone when finished. */
export default function UnlockOverlay({ layer, label, onDone }) {
  useEffect(() => {
    vibrate([30, 60, 30]);
    const t1 = setTimeout(() => heartBurst(0.5, 0.45, 40), 1100);
    const t2 = setTimeout(onDone, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <motion.div
      className="unlock"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      onClick={onDone}
    >
      <div className="unlock__rays" />
      <motion.div
        className="unlock__heart"
        initial={{ scale: 0.2, rotate: -20 }}
        animate={{ scale: [0.2, 1.1, 0.95, 1.08, 1], rotate: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 32 29" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id="unlockG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffb3c6" />
              <stop offset=".5" stopColor="#ff4f8f" />
              <stop offset="1" stopColor="#b14dff" />
            </linearGradient>
          </defs>
          <path fill="url(#unlockG)" d="M16 29S0 19.5 0 9.2C0 3.9 4 0 8.9 0 12 0 14.6 1.6 16 4c1.4-2.4 4-4 7.1-4C28 0 32 3.9 32 9.2 32 19.5 16 29 16 29z" />
        </svg>
        <motion.span
          className="unlock__lock"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1.1, times: [0, 0.8, 1] }}
        >
          <Lock size={40} />
        </motion.span>
        <motion.span
          className="unlock__lock"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, rotate: [0, -12, 8, 0] }}
          transition={{ delay: 1.05, duration: 0.6 }}
        >
          <LockOpen size={40} />
        </motion.span>
      </motion.div>
      <motion.p
        className="unlock__text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        Layer {layer} unlocked
      </motion.p>
      <motion.p className="unlock__sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
        {label}
      </motion.p>
    </motion.div>
  );
}
