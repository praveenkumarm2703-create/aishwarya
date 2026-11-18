import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import config from './config.js';
import { useProgress, SCREENS } from './lib/progress.js';
import { music } from './lib/music.js';
import Background from './components/Background.jsx';
import TopBar from './components/TopBar.jsx';
import UnlockOverlay from './components/UnlockOverlay.jsx';
import Intro from './screens/Intro.jsx';
import QuizLayer from './screens/QuizLayer.jsx';
import MemoryLayer from './screens/MemoryLayer.jsx';
import HeartLayer from './screens/HeartLayer.jsx';
import GrandReveal from './screens/GrandReveal.jsx';

const LAYERS = [null, config.layer1, config.layer2, config.layer3, config.layer4, config.layer5, config.layer6];

const pageVariants = {
  initial: { opacity: 0, y: 30, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.35 } },
};

export default function App() {
  const progress = useProgress();
  const { screen, unlocked, goTo, completeIntro, completeLayer, restart } = progress;
  const layer = SCREENS.indexOf(screen); // 0 = intro, 1..6
  const [unlocking, setUnlocking] = useState(null); // { from, to }

  // Music may only start after she interacts with the page.
  useEffect(() => {
    const kick = () => {
      if (!music.muted && !music.isRunning()) music.start();
    };
    const onVis = () => {
      if (document.hidden) music.suspend();
      else if (music.started && !music.muted) music.start();
    };
    window.addEventListener('pointerdown', kick, true);
    window.addEventListener('touchend', kick, true);
    window.addEventListener('keydown', kick, true);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('pointerdown', kick, true);
      window.removeEventListener('touchend', kick, true);
      window.removeEventListener('keydown', kick, true);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    // match the overscroll area + phone browser bar to the current scene
    const isDark = screen === 'l6';
    document.documentElement.style.background = isDark ? '#1a0526' : '';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#1a0526' : config.site.themeColor);
  }, [screen]);

  const finishLayer = (n) => {
    if (n === 5) completeLayer(5); // straight into the cinematic finale
    else setUnlocking({ from: n, to: n + 1 });
  };

  const unlockingRef = useRef(null);
  unlockingRef.current = unlocking;
  const onUnlockDone = useCallback(() => {
    const u = unlockingRef.current;
    if (!u) return; // already handled (tap + timer)
    unlockingRef.current = null;
    if (u.from === 0) completeIntro();
    else completeLayer(u.from);
    setUnlocking(null);
  }, [completeIntro, completeLayer]);

  const back = layer > 0 ? () => goTo(SCREENS[layer - 1]) : null;

  const renderScreen = () => {
    switch (screen) {
      case 'l1':
        return <QuizLayer number={1} data={config.layer1} variant="cute" onComplete={() => finishLayer(1)} />;
      case 'l2':
        return <QuizLayer number={2} data={config.layer2} variant="detector" onComplete={() => finishLayer(2)} />;
      case 'l3':
        return <MemoryLayer number={3} data={config.layer3} onComplete={() => finishLayer(3)} />;
      case 'l4':
        return <QuizLayer number={4} data={config.layer4} variant="secret" onComplete={() => finishLayer(4)} />;
      case 'l5':
        return <HeartLayer number={5} data={config.layer5} onComplete={() => finishLayer(5)} />;
      case 'l6':
        return <GrandReveal data={config.layer6} onPlayAgain={restart} />;
      default:
        return <Intro onStart={() => setUnlocking({ from: 0, to: 1 })} />;
    }
  };

  const dark = screen === 'l6';

  return (
    <div className={`app ${dark ? 'app--dark' : ''}`}>
      <Background variant={dark ? 'dark' : 'light'} count={dark ? 10 : 22} />

      <TopBar
        layer={layer}
        unlocked={unlocked}
        dark={dark}
        onBack={back}
        onJump={(n) => goTo(SCREENS[n])}
        onRestart={restart}
      />

      <main className="main">
        <AnimatePresence mode="wait">
          <motion.div key={screen} className="page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {unlocking && (
          <UnlockOverlay
            key={unlocking.to}
            layer={unlocking.to}
            label={LAYERS[unlocking.to]?.label}
            onDone={onUnlockDone}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
