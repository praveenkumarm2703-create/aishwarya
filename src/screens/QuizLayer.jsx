import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, HeartPulse, ShieldAlert, Sparkles } from 'lucide-react';
import LayerHeader from '../components/LayerHeader.jsx';
import Mascot from '../components/Mascot.jsx';
import GlowButton from '../components/GlowButton.jsx';
import { fill } from '../config.js';
import { heartBurst, originOf, vibrate } from '../lib/effects.js';

const VARIANTS = {
  cute: { meter: 'Cuteness meter', icon: Sparkles, final: 'OVERLOAD 💥', idleMood: 'happy' },
  detector: { meter: 'Love detector', icon: HeartPulse, final: '100% ❤️', idleMood: 'detective' },
  secret: { meter: 'Clearance level', icon: ShieldAlert, final: 'MAXIMUM 🔐', idleMood: 'smug' },
};

/** Generic question layer used by Layers 1, 2 and 4. */
export default function QuizLayer({ number, data, variant = 'cute', onComplete }) {
  const v = VARIANTS[variant];
  const total = data.questions.length;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const reactionRef = useRef(null);
  const done = idx >= total;
  const question = data.questions[idx];
  const answered = idx + (picked !== null ? 1 : 0);
  const pct = Math.round((answered / total) * 100);
  const Icon = v.icon;

  const choose = (i, e) => {
    if (picked !== null) return;
    setPicked(i);
    vibrate([15, 40, 15]);
    const o = originOf(e.currentTarget);
    heartBurst(o.x, o.y, 18);
  };

  const next = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setPicked(null);
    setIdx((n) => n + 1);
  };

  const mood = done ? 'love' : picked !== null ? question.options[picked].mood || 'happy' : v.idleMood;

  return (
    <div className="screen">
      <LayerHeader number={number} label={data.label} title={data.title} subtitle={data.subtitle} />

      <div className={`meter meter--${variant}`}>
        <span className="meter__label">
          <Icon size={15} /> {v.meter}
        </span>
        <div className="meter__track">
          <motion.div className="meter__fill" animate={{ width: `${Math.max(pct, 6)}%` }} transition={{ type: 'spring', stiffness: 80 }} />
        </div>
        <span className="meter__value">{done ? v.final : `${pct}%`}</span>
      </div>

      <div className="quiz-stage">
        <Mascot mood={mood} size={96} className="quiz-mascot" />

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={idx}
              className={`card quiz-card quiz-card--${variant}`}
              initial={{ opacity: 0, x: 60, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -60, rotate: -2 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
            >
              {variant === 'detector' && <div className="scanline" aria-hidden="true" />}
              {variant === 'secret' && <div className="stamp" aria-hidden="true">Top secret</div>}
              <p className="quiz-card__count">
                Question {idx + 1} of {total}
              </p>
              <h2 className="quiz-card__q">{fill(question.q)}</h2>

              <div className={`options ${question.options.length === 2 ? 'options--two' : ''}`}>
                {question.options.map((opt, i) => {
                  const state = picked === null ? '' : picked === i ? 'option--picked' : 'option--faded';
                  return (
                    <motion.button
                      type="button"
                      key={i}
                      className={`option ${state}`}
                      onClick={(e) => choose(i, e)}
                      whileHover={picked === null ? { scale: 1.03 } : undefined}
                      whileTap={picked === null ? { scale: 0.95 } : undefined}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: picked === null || picked === i ? 1 : 0.45, y: 0 }}
                      transition={{ delay: picked === null ? 0.15 + i * 0.08 : 0 }}
                      aria-pressed={picked === i}
                    >
                      {fill(opt.text)}
                    </motion.button>
                  );
                })}
              </div>

              <AnimatePresence>
                {picked !== null && (
                  <motion.div
                    className="reaction"
                    onAnimationComplete={(def) =>
                      def?.opacity === 1 && reactionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                    }
                    ref={reactionRef}
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <p>{fill(question.options[picked].reaction)}</p>
                    <GlowButton onClick={next} variant="soft" icon={<ArrowRight size={18} />}>
                      {idx + 1 < total ? 'Next question' : 'See my result'}
                    </GlowButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              className="card result-card"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 140, damping: 14 }}
              onAnimationComplete={() => heartBurst(0.5, 0.5, 30)}
            >
              <p className="result-card__title">{data.resultTitle}</p>
              <p className="result-card__text">{fill(data.resultText)}</p>
              <GlowButton onClick={onComplete}>Unlock Layer {number + 1} ❤️</GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
