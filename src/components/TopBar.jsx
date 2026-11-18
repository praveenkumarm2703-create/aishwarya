import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, Volume2, VolumeX, RotateCcw, Heart } from 'lucide-react';
import { music } from '../lib/music.js';
import { vibrate } from '../lib/effects.js';

/** Back button, 1/6 → 6/6 progress, mute toggle and restart. */
export default function TopBar({ layer, unlocked, onBack, onJump, onRestart, dark }) {
  const [muted, setMuted] = useState(music.muted);
  const [confirming, setConfirming] = useState(false);

  const toggleMute = () => {
    vibrate(10);
    const next = !muted;
    setMuted(next);
    music.setMuted(next);
  };

  return (
    <>
      <nav className={`topbar ${dark ? 'topbar--dark' : ''}`} aria-label="Progress">
        <button
          type="button"
          className="icon-btn"
          onClick={onBack}
          aria-label="Go back"
          style={{ visibility: onBack ? 'visible' : 'hidden' }}
        >
          <ChevronLeft size={20} />
        </button>

        {layer > 0 ? (
          <div className="progress">
            <div className="progress__dots">
              {[1, 2, 3, 4, 5, 6].map((n) => {
                const state = n === layer ? 'current' : n <= unlocked ? 'done' : 'locked';
                return (
                  <button
                    type="button"
                    key={n}
                    className={`progress__dot progress__dot--${state}`}
                    onClick={() => n <= unlocked && n !== layer && onJump(n)}
                    disabled={n > unlocked}
                    aria-label={`Layer ${n}${n > unlocked ? ' (locked)' : ''}`}
                  >
                    {state === 'current' ? (
                      <motion.span layoutId="dot-heart" className="progress__heart">
                        <Heart size={14} fill="currentColor" strokeWidth={0} />
                      </motion.span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            <span className="progress__label">{layer}/6</span>
          </div>
        ) : (
          <div className="progress progress--intro">The 6 Layers of Love</div>
        )}

        <div className="topbar__right">
          <button type="button" className="icon-btn" onClick={toggleMute} aria-label={muted ? 'Unmute music' : 'Mute music'}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button type="button" className="icon-btn" onClick={() => setConfirming(true)} aria-label="Restart">
            <RotateCcw size={17} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {confirming && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirming(false)}
          >
            <motion.div
              className="modal card"
              role="dialog"
              aria-modal="true"
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Start all over again?</h3>
              <p>All six layers will be locked again. (The love stays though 💗)</p>
              <div className="modal__actions">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setConfirming(false)}>
                  Stay here
                </button>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => {
                    setConfirming(false);
                    onRestart();
                  }}
                >
                  Restart
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
