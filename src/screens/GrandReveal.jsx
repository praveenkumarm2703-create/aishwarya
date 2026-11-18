import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, RotateCcw } from 'lucide-react';
import LoveSky from '../components/LoveSky.jsx';
import GlowButton from '../components/GlowButton.jsx';
import { fill } from '../config.js';
import { celebrate, heartBurst, vibrate } from '../lib/effects.js';

/**
 * Layer 6 – the cinematic finale.
 * phases: closed → opening (flap opens, letter rises) → letter (full love letter)
 */
export default function GrandReveal({ data, onPlayAgain }) {
  const [phase, setPhase] = useState('closed');

  const open = () => {
    if (phase !== 'closed') return;
    vibrate([40, 60, 40, 60, 200]);
    setPhase('opening');
  };

  useEffect(() => {
    if (phase !== 'opening') return;
    const t1 = setTimeout(() => heartBurst(0.5, 0.45, 50), 700);
    const t2 = setTimeout(() => {
      setPhase('letter');
      celebrate();
    }, 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [phase]);

  // keep the confetti coming every so often while she reads
  useEffect(() => {
    if (phase !== 'letter') return;
    const id = setInterval(() => heartBurst(Math.random() * 0.8 + 0.1, 0.1, 18), 4200);
    return () => clearInterval(id);
  }, [phase]);

  return (
    <div className="finale">
      <LoveSky fireworks={phase !== 'closed'} />

      <AnimatePresence mode="wait">
        {phase !== 'letter' ? (
          <motion.div
            key="envelope"
            className="finale__stage"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(10px)', transition: { duration: 0.6 } }}
            transition={{ duration: 1 }}
          >
            <motion.p
              className="finale__eyebrow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Layer 6 · {data.label}
            </motion.p>

            <motion.button
              type="button"
              className={`envelope ${phase === 'opening' ? 'envelope--open' : ''}`}
              onClick={open}
              aria-label="Open the envelope"
              animate={phase === 'closed' ? { y: [0, -10, 0], rotate: [-1.5, 1.5, -1.5] } : { y: 30, rotate: 0 }}
              transition={phase === 'closed' ? { duration: 3.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.8 }}
              whileHover={phase === 'closed' ? { scale: 1.04 } : undefined}
              whileTap={phase === 'closed' ? { scale: 0.96 } : undefined}
            >
              <span className="envelope__glow" />
              <span className="envelope__back" />
              <motion.span
                className="envelope__letter"
                initial={false}
                animate={phase === 'opening' ? { y: '-62%' } : { y: '0%' }}
                transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="envelope__letter-text">{fill(data.headline)}</span>
              </motion.span>
              <span className="envelope__front" />
              <motion.span
                className="envelope__flap"
                initial={false}
                animate={phase === 'opening' ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 4 }}
                transition={{ duration: 0.6, ease: 'easeInOut', zIndex: { delay: 0.3 } }}
              />
              <motion.span
                className="envelope__seal"
                animate={phase === 'opening' ? { scale: 0, opacity: 0 } : { scale: [1, 1.12, 1] }}
                transition={phase === 'opening' ? { duration: 0.3 } : { duration: 1.2, repeat: Infinity }}
              >
                <Heart size={22} fill="currentColor" strokeWidth={0} />
              </motion.span>
              <span className="envelope__to">{fill(data.envelopeLabel)}</span>
            </motion.button>

            <motion.p
              className="finale__hint"
              animate={{ opacity: phase === 'closed' ? [0.5, 1, 0.5] : 0 }}
              transition={{ duration: 2, repeat: phase === 'closed' ? Infinity : 0 }}
            >
              {data.tapHint}
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            className="finale__letter-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.article
              className="letter"
              initial={{ y: 80, scale: 0.85, rotateX: 18 }}
              animate={{ y: 0, scale: 1, rotateX: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            >
              <motion.h1
                className="letter__headline"
                initial={{ opacity: 0, scale: 0.6, filter: 'blur(12px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              >
                {fill(data.headline)}
              </motion.h1>

              <div className="letter__body">
                {data.letter.map((para, i) => {
                  const last = i === data.letter.length - 1;
                  return (
                    <motion.p
                      key={i}
                      className={last ? 'letter__big' : ''}
                      initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      transition={{ delay: 1.4 + i * 0.9, duration: 0.9 }}
                    >
                      {fill(para)
                        .split('\n')
                        .map((line, j, arr) => (
                          <span key={j}>
                            {line}
                            {j < arr.length - 1 && <br />}
                          </span>
                        ))}
                    </motion.p>
                  );
                })}
              </div>

              <motion.div
                className="letter__sign"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + data.letter.length * 0.9 + 0.3, duration: 1 }}
              >
                <p className="letter__signoff">{fill(data.signOff)}</p>
                <p className="letter__signature">{fill(data.signature)}</p>
              </motion.div>

              <motion.div
                className="letter__actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 + data.letter.length * 0.9 + 1.2 }}
              >
                <GlowButton onClick={onPlayAgain} icon={<RotateCcw size={18} />}>
                  {data.playAgain}
                </GlowButton>
              </motion.div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
