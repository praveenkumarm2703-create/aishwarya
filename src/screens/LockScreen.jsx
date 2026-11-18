import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { Lock, LockOpen } from 'lucide-react';
import Mascot from '../components/Mascot.jsx';
import GlowButton from '../components/GlowButton.jsx';
import config, { fill } from '../config.js';
import { celebrate, vibrate } from '../lib/effects.js';

const t = config.lock;
// ignore capitals, spaces, dots, slashes and dashes
const normalize = (v) => fill(String(v)).toLowerCase().replace(/[\s./\\-]/g, '');

export default function LockScreen({ onUnlock }) {
  const [value, setValue] = useState('');
  const [tries, setTries] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [granted, setGranted] = useState(false);
  const shake = useAnimationControls();
  const inputRef = useRef(null);

  useEffect(() => {
    if (!granted) return;
    const id = setTimeout(onUnlock, 2200);
    return () => clearTimeout(id);
  }, [granted, onUnlock]);

  const submit = (e) => {
    e?.preventDefault();
    if (granted || !value.trim()) return;
    if (t.answers.some((a) => normalize(a) === normalize(value))) {
      inputRef.current?.blur();
      setGranted(true);
      celebrate();
      vibrate([40, 60, 40, 60, 120]);
    } else {
      setTries((n) => n + 1);
      if (tries + 1 >= 2) setShowHint(true);
      vibrate([80, 40, 80]);
      shake.start({ x: [0, -14, 14, -10, 10, -5, 5, 0], transition: { duration: 0.5 } });
      setValue('');
    }
  };

  const wrong = tries > 0 ? t.wrongMessages[(tries - 1) % t.wrongMessages.length] : null;

  return (
    <div className="screen screen--center lock">
      <AnimatePresence mode="wait">
        {!granted ? (
          <motion.div key="lock" className="lock__inner" exit={{ opacity: 0, scale: 0.9 }}>
            <Mascot mood={tries > 0 ? 'smug' : 'detective'} size={130} />
            <motion.div className="lock__badge" animate={{ rotate: [0, -8, 8, 0] }} transition={{ duration: 2.4, repeat: Infinity }}>
              <Lock size={22} />
            </motion.div>
            <h1 className="title">{fill(t.title)}</h1>
            <p className="lead">{fill(t.prompt)}</p>

            <motion.form className="lock__form card" onSubmit={submit} animate={shake}>
              <input
                ref={inputRef}
                className="lock__input"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder={fill(t.placeholder)}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-label={fill(t.placeholder)}
              />
              <GlowButton type="submit" onClick={submit} disabled={!value.trim()}>
                {fill(t.button)}
              </GlowButton>
            </motion.form>

            <div className="lock__feedback" aria-live="polite">
              <AnimatePresence mode="wait">
                {wrong && (
                  <motion.p key={tries} className="lock__wrong" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    {wrong}
                  </motion.p>
                )}
              </AnimatePresence>
              {showHint ? (
                <motion.p className="lock__hint" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                  {fill(t.hint)}
                </motion.p>
              ) : (
                <button type="button" className="link-btn" onClick={() => setShowHint(true)}>
                  {fill(t.hintButton)}
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="granted"
            className="lock__inner"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 14 }}
          >
            <Mascot mood="love" size={140} />
            <motion.div className="lock__badge lock__badge--open" initial={{ rotate: -30 }} animate={{ rotate: 0 }}>
              <LockOpen size={22} />
            </motion.div>
            <h1 className="title">{fill(t.success)}</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
