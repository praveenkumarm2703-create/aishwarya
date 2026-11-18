import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Mascot from '../components/Mascot.jsx';
import GlowButton from '../components/GlowButton.jsx';
import config, { fill } from '../config.js';
import { celebrate, vibrate } from '../lib/effects.js';

const t = config.intro;

export default function Intro({ onStart }) {
  const [confirmed, setConfirmed] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const zoneRef = useRef(null);
  const noRef = useRef(null);
  const yesRef = useRef(null);

  // Make the "No" button run away from her finger / cursor
  const dodge = () => {
    vibrate(25);
    const zone = zoneRef.current?.getBoundingClientRect();
    const btn = noRef.current?.getBoundingClientRect();
    const yesBtn = yesRef.current?.getBoundingClientRect();
    if (!zone || !btn) return;
    // the button's resting position (without the current offset)
    const baseX = btn.left - noPos.x;
    const baseY = btn.top - noPos.y;
    const maxX = Math.max(0, zone.width / 2 - btn.width / 2);
    const overlapsYes = (x, y) => {
      if (!yesBtn) return false;
      const l = baseX + x;
      const t = baseY + y;
      const pad = 14;
      return !(l + btn.width < yesBtn.left - pad || l > yesBtn.right + pad || t + btn.height < yesBtn.top - pad || t > yesBtn.bottom + pad);
    };
    let x = 0;
    let y = 0;
    for (let tries = 0; tries < 40; tries++) {
      x = (Math.random() * 2 - 1) * maxX;
      y = Math.random() * 120 - 30; // mostly below "Yes", never far off-screen
      const farEnough = Math.hypot(x - noPos.x, y - noPos.y) > 70;
      if (farEnough && !overlapsYes(x, y)) break;
    }
    if (overlapsYes(x, y)) {
      x = noPos.x > 0 ? -maxX : maxX;
      y = 90;
    }
    setNoPos({ x, y });
    setNoCount((c) => c + 1);
  };

  const yes = () => {
    setConfirmed(true);
    celebrate();
    vibrate([40, 60, 40]);
  };

  const tease = noCount > 0 ? t.noTeases[(noCount - 1) % t.noTeases.length] : null;
  // "Yes" grows a bit every time she tries "No"
  const yesScale = 1 + Math.min(noCount, 6) * 0.06;

  return (
    <div className="screen screen--center intro">
      <AnimatePresence mode="wait">
        {!confirmed ? (
          <motion.div
            key="ask"
            className="intro__inner"
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
            transition={{ duration: 0.4 }}
          >
            <Mascot mood={noCount > 2 ? 'smug' : 'detective'} size={150} />
            <motion.h1
              className="title title--hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              {fill(t.greeting)}
            </motion.h1>
            <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              {fill(t.line1)}
            </motion.p>
            <motion.p className="lead lead--strong" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
              {fill(t.line2)}
            </motion.p>

            <motion.div
              className="intro__zone"
              ref={zoneRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8 }}
            >
              <motion.div ref={yesRef} animate={{ scale: yesScale }} transition={{ type: 'spring', stiffness: 300 }}>
                <GlowButton onClick={yes}>{t.yesButton}</GlowButton>
              </motion.div>
              <motion.button
                ref={noRef}
                type="button"
                className="btn btn--ghost intro__no"
                animate={{ x: noPos.x, y: noPos.y, rotate: noCount ? (noCount % 2 ? -6 : 6) : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                onPointerEnter={(e) => e.pointerType === 'mouse' && dodge()}
                onPointerDown={() => dodge()}
                onClick={(e) => e.detail === 0 && dodge() /* keyboard */}
              >
                {t.noButton}
              </motion.button>
            </motion.div>

            <div className="intro__tease" aria-live="polite">
              <AnimatePresence mode="wait">
                {tease && (
                  <motion.p
                    key={noCount}
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                  >
                    {tease}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirmed"
            className="intro__inner"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          >
            <Mascot mood="love" size={150} />
            <motion.div
              className="certificate card"
              initial={{ rotate: -4, y: 30, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <span className="certificate__seal">✓</span>
              <h2 className="certificate__title">{fill(t.confirmed)}</h2>
              <p className="certificate__sub">{fill(t.confirmedSub)}</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
              <GlowButton onClick={onStart} className="btn--pulse">
                {t.startButton}
              </GlowButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
