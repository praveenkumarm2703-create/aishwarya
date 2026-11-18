import { useCallback, useEffect, useState } from 'react';

const KEY = 'six-layers-of-love:v1';

export const SCREENS = ['intro', 'l1', 'l2', 'l3', 'l4', 'l5', 'l6'];

const initial = { screen: 'intro', unlocked: 0, introDone: false };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const data = JSON.parse(raw);
    if (!SCREENS.includes(data.screen)) return initial;
    return { ...initial, ...data };
  } catch {
    return initial;
  }
}

/**
 * Progress lives in localStorage so a refresh keeps her where she was.
 *  - `unlocked`: highest layer number (1..6) she is allowed to open.
 *  - `screen`: the screen currently shown.
 */
export function useProgress() {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode – progress just won't persist */
    }
  }, [state]);

  const goTo = useCallback((screen) => {
    setState((s) => {
      const idx = SCREENS.indexOf(screen);
      if (idx < 0 || idx > s.unlocked) return s;
      return { ...s, screen };
    });
  }, []);

  const completeIntro = useCallback(() => {
    setState((s) => ({ ...s, introDone: true, unlocked: Math.max(s.unlocked, 1), screen: 'l1' }));
  }, []);

  /** Finish layer n and open layer n+1. */
  const completeLayer = useCallback((n) => {
    setState((s) => {
      const next = Math.min(n + 1, 6);
      return { ...s, unlocked: Math.max(s.unlocked, next), screen: SCREENS[next] };
    });
  }, []);

  const restart = useCallback(() => {
    setState(initial);
  }, []);

  return { ...state, goTo, completeIntro, completeLayer, restart };
}
